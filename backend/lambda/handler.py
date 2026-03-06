import json
import boto3
import os
from datetime import datetime
from decimal import Decimal

# Initialize AWS clients
bedrock_runtime = boto3.client('bedrock-runtime', region_name=os.environ.get('AWS_REGION', 'us-east-1'))
dynamodb = boto3.resource('dynamodb', region_name=os.environ.get('AWS_REGION', 'us-east-1'))
s3 = boto3.client('s3', region_name=os.environ.get('AWS_REGION', 'us-east-1'))

# Environment variables
TABLE_NAME = os.environ.get('DYNAMODB_TABLE', 'wise-drop-advisories')
S3_BUCKET = os.environ.get('S3_BUCKET', 'wise-drop-data')
BEDROCK_MODEL_ID = os.environ.get('BEDROCK_MODEL_ID', 'anthropic.claude-3-sonnet-20240229-v1:0')


def load_prompt_template(role):
    """Load prompt template for the specified role"""
    prompts = {
        'farmer': """You are an AI assistant helping farmers with groundwater and irrigation decisions.

Location: {state}, {district}
Groundwater Data: {groundwater_data}

Provide simple, actionable advice for a farmer in this region. Focus on:
- Irrigation timing and water conservation
- Crop selection based on water availability
- Practical water-saving techniques

Keep the language friendly, non-technical, and action-oriented. Limit response to 200 words.""",

        'officer': """You are an AI assistant helping village officers manage groundwater resources.

Location: {state}, {district}
Groundwater Data: {groundwater_data}

Provide a structured summary for a village officer including:
- Current groundwater risk assessment
- Priority intervention areas
- Community-level recommendations

Use semi-technical language suitable for local administration. Limit response to 250 words.""",

        'policymaker': """You are an AI assistant helping policy makers with groundwater strategy.

Location: {state}, {district}
Groundwater Data: {groundwater_data}

Provide strategic policy insights including:
- Long-term sustainability risks
- Data-driven policy recommendations
- Regional trends and patterns

Use formal, data-driven language suitable for policy decisions. Limit response to 300 words."""
    }
    return prompts.get(role, prompts['farmer'])


def get_groundwater_data(state, district):
    """
    Fetch and aggregate village-level groundwater data from S3
    Aggregates multiple village records for the given state and district
    """
    try:
        # Read pan-India village dataset from S3
        key = "groundwater-data/india_villages.json"
        response = s3.get_object(Bucket=S3_BUCKET, Key=key)
        all_villages = json.loads(response['Body'].read())
        
        # Filter villages by state and district (case-insensitive)
        state_lower = state.lower().strip()
        district_lower = district.lower().strip()
        
        matching_villages = [
            v for v in all_villages 
            if v.get('state', '').lower().strip() == state_lower 
            and v.get('district', '').lower().strip() == district_lower
        ]
        
        # Log number of villages found
        village_count = len(matching_villages)
        print(f"📊 Found {village_count} villages for {state}, {district}")
        
        # If no villages found, return error
        if village_count == 0:
            raise ValueError(f"No data available for {district}, {state}")
        
        # Aggregate metrics across all matching villages
        aggregated_data = aggregate_village_data(matching_villages)
        aggregated_data['village_count'] = village_count
        
        return aggregated_data
        
    except Exception as e:
        print(f"⚠️ S3 read error: {e}")
        # Fallback to mock data for demo purposes
        print("Using mock data for demonstration")
        return {
            'avg_aquifer_depth_m': 18.5,
            'avg_extraction_rate_lpd': 125000,
            'avg_recharge_rate_mm': 450,
            'max_fluoride_ppm': 1.2,
            'max_arsenic_ppb': 8,
            'drought_prone': False,
            'village_count': 1,
            'data_source': 'mock'
        }


def aggregate_village_data(villages):
    """
    Aggregate metrics from multiple village records
    
    Args:
        villages: List of village data dictionaries
    
    Returns:
        Dictionary with aggregated metrics
    """
    if not villages:
        return {}
    
    # Extract numeric values for averaging
    aquifer_depths = [v.get('aquifer_depth_m', 0) for v in villages if v.get('aquifer_depth_m')]
    extraction_rates = [v.get('extraction_rate_lpd', 0) for v in villages if v.get('extraction_rate_lpd')]
    recharge_rates = [v.get('recharge_rate_mm', 0) for v in villages if v.get('recharge_rate_mm')]
    fluoride_levels = [v.get('fluoride_ppm', 0) for v in villages if v.get('fluoride_ppm')]
    arsenic_levels = [v.get('arsenic_ppb', 0) for v in villages if v.get('arsenic_ppb')]
    
    # Check if any village is drought-prone
    drought_prone = any(v.get('drought_prone', False) for v in villages)
    
    # Calculate aggregated metrics
    aggregated = {
        'avg_aquifer_depth_m': round(sum(aquifer_depths) / len(aquifer_depths), 2) if aquifer_depths else 0,
        'avg_extraction_rate_lpd': round(sum(extraction_rates) / len(extraction_rates), 2) if extraction_rates else 0,
        'avg_recharge_rate_mm': round(sum(recharge_rates) / len(recharge_rates), 2) if recharge_rates else 0,
        'max_fluoride_ppm': round(max(fluoride_levels), 2) if fluoride_levels else 0,
        'max_arsenic_ppb': round(max(arsenic_levels), 2) if arsenic_levels else 0,
        'drought_prone': drought_prone
    }
    
    print(f"✅ Aggregated data: {aggregated}")
    return aggregated


def invoke_bedrock(prompt):
    """Call Amazon Bedrock to generate AI response"""
    try:
        body = json.dumps({
            "anthropic_version": "bedrock-2023-05-31",
            "max_tokens": 1024,
            "messages": [
                {
                    "role": "user",
                    "content": prompt
                }
            ]
        })
        
        response = bedrock_runtime.invoke_model(
            modelId=BEDROCK_MODEL_ID,
            body=body
        )
        
        response_body = json.loads(response['body'].read())
        return response_body['content'][0]['text']
    
    except Exception as e:
        print(f"Bedrock error: {e}")
        raise Exception(f"AI generation failed: {str(e)}")


def save_to_dynamodb(role, state, district, advice):
    """Store generated advisory in DynamoDB"""
    try:
        table = dynamodb.Table(TABLE_NAME)
        item = {
            'id': f"{role}#{state}#{district}#{int(datetime.now().timestamp())}",
            'role': role,
            'state': state,
            'district': district,
            'advice': advice,
            'timestamp': datetime.now().isoformat()
        }
        table.put_item(Item=item)
    except Exception as e:
        print(f"DynamoDB error: {e}")
        # Don't fail the request if storage fails


def lambda_handler(event, context):
    """
    Main Lambda handler - Agent Orchestrator
    Routes requests to appropriate agent based on role
    """
    try:
        # Parse request
        body = json.loads(event.get('body', '{}'))
        role = body.get('role', '').lower()
        state = body.get('state', '')
        district = body.get('district', '')
        
        # Validate input
        if role not in ['farmer', 'officer', 'policymaker']:
            return {
                'statusCode': 400,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'Invalid role. Must be farmer, officer, or policymaker'})
            }
        
        if not state or not district:
            return {
                'statusCode': 400,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'State and district are required'})
            }
        
        print(f"🔍 Processing request for role={role}, state={state}, district={district}")
        
        # Fetch and aggregate groundwater data from village-level dataset
        try:
            groundwater_data = get_groundwater_data(state, district)
        except ValueError as ve:
            # No villages found for this location
            return {
                'statusCode': 404,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': str(ve)})
            }
        
        # Load appropriate prompt template
        prompt_template = load_prompt_template(role)
        
        # Format prompt with data
        prompt = prompt_template.format(
            state=state,
            district=district,
            groundwater_data=json.dumps(groundwater_data, indent=2)
        )
        
        # Generate AI response using Bedrock
        advice = invoke_bedrock(prompt)
        
        # Store in DynamoDB
        save_to_dynamodb(role, state, district, advice)
        
        # Return response
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'advice': advice})
        }
    
    except Exception as e:
        print(f"Error: {e}")
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': str(e)})
        }

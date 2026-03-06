"""
Wise Drop - AWS Lambda Handler
AI-powered groundwater intelligence platform with multi-agent architecture

This Lambda function:
1. Loads village-level groundwater data from S3
2. Aggregates metrics by state and district
3. Routes requests to role-specific AI agents (Farmer, Officer, Policy Maker)
4. Generates personalized advice using Amazon Bedrock Claude 3 Sonnet
5. Returns structured JSON response with CORS support
"""

import json
import boto3
import os
from datetime import datetime

# Initialize AWS clients
s3_client = boto3.client('s3')
bedrock_runtime = boto3.client('bedrock-runtime', region_name=os.environ.get('AWS_REGION', 'us-east-1'))

# Environment variables
DATA_BUCKET = os.environ.get('DATA_BUCKET')
DATA_KEY = os.environ.get('DATA_KEY', 'groundwater-data/india_villages.json')
BEDROCK_MODEL_ID = 'anthropic.claude-3-sonnet-20240229-v1:0'


def lambda_handler(event, context):
    """
    Main Lambda handler - Agent Orchestrator
    Routes requests to appropriate AI agent based on user role
    """
    try:
        # Parse incoming request
        body = json.loads(event.get('body', '{}'))
        role = body.get('role', '').lower()
        state = body.get('state', '').strip()
        district = body.get('district', '').strip()
        
        print(f"📥 Request received: role={role}, state={state}, district={district}")
        
        # Validate role
        if role not in ['farmer', 'officer', 'policymaker']:
            return create_response(400, {
                'error': 'Invalid role. Must be farmer, officer, or policymaker'
            })
        
        # Validate location
        if not state or not district:
            return create_response(400, {
                'error': 'State and district are required'
            })
        
        # Load and aggregate groundwater data
        groundwater_metrics = load_and_aggregate_data(state, district)
        
        # Build role-specific prompt
        prompt = build_prompt(role, state, district, groundwater_metrics)
        
        # Generate AI advice using Bedrock
        advice = generate_advice_with_bedrock(prompt)
        
        # Return successful response
        return create_response(200, {
            'role': role,
            'state': state,
            'district': district,
            'advice': advice,
            'generated_at': datetime.utcnow().isoformat() + 'Z'
        })
        
    except ValueError as ve:
        # Data not found or validation error
        print(f"❌ Validation error: {ve}")
        return create_response(404, {'error': str(ve)})
        
    except Exception as e:
        # Unexpected error
        print(f"❌ Unexpected error: {e}")
        return create_response(500, {'error': 'Internal server error'})


def load_and_aggregate_data(state, district):
    """
    Load village-level data from S3 and aggregate by state + district
    
    Args:
        state: State name
        district: District name
    
    Returns:
        Dictionary with aggregated groundwater metrics
    
    Raises:
        ValueError: If no villages found for the location
    """
    print(f"📂 Loading data from s3://{DATA_BUCKET}/{DATA_KEY}")
    
    # Load JSON data from S3
    response = s3_client.get_object(Bucket=DATA_BUCKET, Key=DATA_KEY)
    all_villages = json.loads(response['Body'].read())
    
    # Filter villages by state and district (case-insensitive)
    state_lower = state.lower()
    district_lower = district.lower()
    
    matching_villages = [
        village for village in all_villages
        if village.get('state', '').lower() == state_lower
        and village.get('district', '').lower() == district_lower
    ]
    
    village_count = len(matching_villages)
    print(f"📊 Found {village_count} villages in {district}, {state}")
    
    # Raise error if no villages found
    if village_count == 0:
        raise ValueError(f"No groundwater data available for {district}, {state}")
    
    # Aggregate metrics across all villages
    metrics = aggregate_metrics(matching_villages)
    metrics['village_count'] = village_count
    
    print(f"✅ Aggregated metrics: {metrics}")
    return metrics


def aggregate_metrics(villages):
    """
    Aggregate groundwater metrics from multiple village records
    
    Aggregation rules:
    - Average: aquifer_depth_m, extraction_rate_lpd, recharge_rate_mm
    - Maximum: fluoride_ppm, arsenic_ppb (worst-case scenario)
    - Boolean OR: drought_prone (true if any village is drought-prone)
    
    Args:
        villages: List of village data dictionaries
    
    Returns:
        Dictionary with aggregated metrics
    """
    # Extract numeric values for averaging
    aquifer_depths = [v['aquifer_depth_m'] for v in villages if 'aquifer_depth_m' in v]
    extraction_rates = [v['extraction_rate_lpd'] for v in villages if 'extraction_rate_lpd' in v]
    recharge_rates = [v['recharge_rate_mm'] for v in villages if 'recharge_rate_mm' in v]
    fluoride_levels = [v['fluoride_ppm'] for v in villages if 'fluoride_ppm' in v]
    arsenic_levels = [v['arsenic_ppb'] for v in villages if 'arsenic_ppb' in v]
    
    # Check if any village is drought-prone
    drought_prone = any(v.get('drought_prone', False) for v in villages)
    
    # Calculate aggregated values
    return {
        'avg_aquifer_depth_m': round(sum(aquifer_depths) / len(aquifer_depths), 2) if aquifer_depths else None,
        'avg_extraction_rate_lpd': round(sum(extraction_rates) / len(extraction_rates), 0) if extraction_rates else None,
        'avg_recharge_rate_mm': round(sum(recharge_rates) / len(recharge_rates), 2) if recharge_rates else None,
        'max_fluoride_ppm': round(max(fluoride_levels), 2) if fluoride_levels else None,
        'max_arsenic_ppb': round(max(arsenic_levels), 2) if arsenic_levels else None,
        'drought_prone': drought_prone
    }


def build_prompt(role, state, district, metrics):
    """
    Build role-specific prompt for AI generation
    
    Each role has a distinct persona and output format:
    - Farmer: Simple, actionable, friendly
    - Officer: Structured, operational, semi-technical
    - Policy Maker: Strategic, formal, data-driven
    
    Args:
        role: User role (farmer, officer, policymaker)
        state: State name
        district: District name
        metrics: Aggregated groundwater metrics
    
    Returns:
        Formatted prompt string for Bedrock
    """
    # Format metrics for readability
    metrics_text = f"""
Aquifer Depth: {metrics['avg_aquifer_depth_m']}m (average)
Water Extraction Rate: {metrics['avg_extraction_rate_lpd']:,.0f} liters/day (average)
Recharge Rate: {metrics['avg_recharge_rate_mm']}mm/year (average)
Fluoride Level: {metrics['max_fluoride_ppm']} ppm (maximum)
Arsenic Level: {metrics['max_arsenic_ppb']} ppb (maximum)
Drought Prone: {'Yes' if metrics['drought_prone'] else 'No'}
Villages Analyzed: {metrics['village_count']}
"""
    
    # Role-specific prompt templates
    prompts = {
        'farmer': f"""You are an AI assistant helping farmers with groundwater and irrigation decisions.

Location: {district}, {state}

Groundwater Data:
{metrics_text}

Provide simple, actionable advice for a farmer in this region. Focus on:
- Irrigation timing and water conservation tips
- Crop selection based on water availability
- Practical water-saving techniques they can implement immediately

Keep the language friendly, non-technical, and action-oriented. Use short sentences and bullet points where helpful. Limit response to 200 words.""",

        'officer': f"""You are an AI assistant helping village officers manage groundwater resources.

Location: {district}, {state}

Groundwater Data:
{metrics_text}

Provide a structured summary for a village officer including:
- Current groundwater risk assessment (low/medium/high)
- Priority intervention areas that need immediate attention
- Community-level recommendations for sustainable water management

Use semi-technical language suitable for local administration. Be specific and actionable. Limit response to 250 words.""",

        'policymaker': f"""You are an AI assistant helping policy makers develop groundwater strategy.

Location: {district}, {state}

Groundwater Data:
{metrics_text}

Provide strategic policy insights including:
- Long-term sustainability risks and trends
- Data-driven policy recommendations for the region
- Regional patterns that require policy intervention

Use formal, data-driven language suitable for policy decisions. Reference specific metrics in your analysis. Limit response to 300 words."""
    }
    
    return prompts[role]


def generate_advice_with_bedrock(prompt):
    """
    Generate AI advice using Amazon Bedrock Claude 3 Sonnet
    
    Args:
        prompt: Formatted prompt string
    
    Returns:
        Generated advice text
    
    Raises:
        Exception: If Bedrock invocation fails
    """
    print(f"🤖 Invoking Bedrock model: {BEDROCK_MODEL_ID}")
    
    # Prepare request body for Claude 3
    request_body = {
        "anthropic_version": "bedrock-2023-05-31",
        "max_tokens": 1024,
        "temperature": 0.7,
        "messages": [
            {
                "role": "user",
                "content": prompt
            }
        ]
    }
    
    # Invoke Bedrock
    response = bedrock_runtime.invoke_model(
        modelId=BEDROCK_MODEL_ID,
        body=json.dumps(request_body)
    )
    
    # Parse response
    response_body = json.loads(response['body'].read())
    advice = response_body['content'][0]['text']
    
    print(f"✅ Generated {len(advice)} characters of advice")
    return advice


def create_response(status_code, body):
    """
    Create standardized HTTP response with CORS headers
    
    Args:
        status_code: HTTP status code
        body: Response body dictionary
    
    Returns:
        API Gateway response object
    """
    return {
        'statusCode': status_code,
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type'
        },
        'body': json.dumps(body)
    }

"""
Wise Drop - AWS Lambda Handler (Amazon Nova Pro)
AI-powered groundwater intelligence platform with multi-agent architecture

Updated features:
- Amazon Nova Pro model (us.amazon.nova-pro-v1:0)
- Risk level calculation (Critical/High/Moderate/Low)
- Summary extraction from AI response
- Support for Uttar Pradesh state
"""

import json
import boto3
import os
from datetime import datetime

# Initialize AWS clients
s3_client = boto3.client('s3')
bedrock_runtime = boto3.client('bedrock-runtime', region_name='us-east-1')

# Environment variables
DATA_BUCKET = os.environ.get('DATA_BUCKET')
DATA_KEY = os.environ.get('DATA_KEY', 'groundwater-data/india_villages.json')


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
        
        print(f"📥 Request: role={role}, state={state}, district={district}")
        
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
        data = load_groundwater_data()
        villages = get_district_villages(data, state, district)
        
        if not villages:
            return create_response(404, {
                'error': 'No data found for this state and district combination'
            })
        
        # Aggregate metrics
        analysis = aggregate_district_data(villages)
        
        # Calculate risk level
        risk_level = get_risk_level(analysis['avg_aquifer_depth_m'])
        
        # Build role-specific prompt
        prompt = build_prompt(role, state, district, analysis)
        
        # Generate AI advice using Amazon Nova Pro
        advice = call_ai(prompt)
        
        # Extract summary from advice
        summary = extract_summary(advice)
        
        # Return successful response
        return create_response(200, {
            'role': role,
            'state': state,
            'district': district,
            'advice': advice,
            'summary': summary,
            'risk_level': risk_level,
            'generated_at': datetime.utcnow().isoformat() + 'Z'
        })
        
    except ValueError as ve:
        print(f"❌ Validation error: {ve}")
        return create_response(404, {'error': str(ve)})
        
    except Exception as e:
        print(f"❌ Unexpected error: {e}")
        return create_response(500, {'error': 'Internal server error'})


def load_groundwater_data():
    """Load village-level data from S3"""
    print(f"📂 Loading data from s3://{DATA_BUCKET}/{DATA_KEY}")
    response = s3_client.get_object(Bucket=DATA_BUCKET, Key=DATA_KEY)
    return json.loads(response['Body'].read())


def get_district_villages(data, state, district):
    """Filter villages by state and district (case-insensitive)"""
    state_lower = state.lower()
    district_lower = district.lower()
    
    villages = [
        row for row in data
        if row.get('state', '').strip().lower() == state_lower
        and row.get('district', '').strip().lower() == district_lower
    ]
    
    print(f"📊 Found {len(villages)} villages")
    return villages


def aggregate_district_data(villages):
    """
    Aggregate groundwater metrics from multiple village records
    
    Returns:
        Dictionary with aggregated metrics
    """
    count = len(villages)
    
    return {
        'village_count': count,
        'avg_aquifer_depth_m': sum(v['aquifer_depth_m'] for v in villages) / count,
        'avg_extraction_rate_lpd': sum(v['extraction_rate_lpd'] for v in villages) / count,
        'avg_recharge_rate_mm': sum(v['recharge_rate_mm'] for v in villages) / count,
        'max_fluoride_ppm': max(v['fluoride_ppm'] for v in villages),
        'max_arsenic_ppb': max(v['arsenic_ppb'] for v in villages),
        'drought_prone': any(v.get('is_drought_prone') == 'Yes' for v in villages)
    }


def get_risk_level(avg_aquifer_depth):
    """
    Calculate risk level based on aquifer depth
    
    Risk levels:
    - Critical: < 20m
    - High: 20-35m
    - Moderate: 35-50m
    - Low: > 50m
    """
    if avg_aquifer_depth < 20:
        return 'Critical'
    elif avg_aquifer_depth < 35:
        return 'High'
    elif avg_aquifer_depth < 50:
        return 'Moderate'
    else:
        return 'Low'


def build_prompt(role, state, district, analysis):
    """
    Build role-specific prompt for AI generation
    Each prompt instructs the AI to include a SUMMARY line at the end
    """
    context = f"""
State: {state}
District: {district}
Villages Analyzed: {analysis['village_count']}

Average Aquifer Depth: {analysis['avg_aquifer_depth_m']:.1f} meters
Average Extraction Rate: {analysis['avg_extraction_rate_lpd']:.0f} liters/day
Average Recharge Rate: {analysis['avg_recharge_rate_mm']:.1f} mm/month

Maximum Fluoride Level: {analysis['max_fluoride_ppm']} ppm
Maximum Arsenic Level: {analysis['max_arsenic_ppb']} ppb
Drought Prone Area: {analysis['drought_prone']}
"""
    
    if role == 'farmer':
        return f"""You are an AI groundwater advisor for Indian farmers.
{context}
Provide:
- Practical irrigation advice
- Crop suggestions based on water availability
- Simple water conservation steps

Avoid technical jargon. Use simple language.

At the very end, write one line starting with SUMMARY: that summarizes your advice in under 20 words."""
    
    if role == 'officer':
        return f"""You are a village-level groundwater officer.
{context}
Provide:
- Risk summary for the district
- Operational recommendations
- Monitoring priorities

Use structured points.

At the very end, write one line starting with SUMMARY: that summarizes your advice in under 20 words."""
    
    if role == 'policymaker':
        return f"""You are a state-level water policy advisor.
{context}
Provide:
- Strategic insights for policy decisions
- Sustainability risks
- Policy recommendations

Use a formal tone.

At the very end, write one line starting with SUMMARY: that summarizes your advice in under 20 words."""
    
    raise ValueError('Invalid role')


def call_ai(prompt):
    """
    Generate AI advice using Amazon Nova Pro
    
    Model: us.amazon.nova-pro-v1:0
    Region: us-east-1
    """
    print(f"🤖 Invoking Amazon Nova Pro")
    
    body = {
        'schemaVersion': 'messages-v1',
        'messages': [
            {
                'role': 'user',
                'content': [{'text': prompt}]
            }
        ],
        'inferenceConfig': {
            'max_new_tokens': 400,
            'temperature': 0.3
        }
    }
    
    response = bedrock_runtime.invoke_model(
        modelId='us.amazon.nova-pro-v1:0',
        body=json.dumps(body)
    )
    
    result = json.loads(response['body'].read())
    advice = result['output']['message']['content'][0]['text']
    
    print(f"✅ Generated {len(advice)} characters of advice")
    return advice


def extract_summary(advice_text):
    """
    Extract SUMMARY line from AI response
    Falls back to generic message if not found
    """
    for line in advice_text.split('\n'):
        if line.strip().startswith('SUMMARY:'):
            return line.replace('SUMMARY:', '').strip()
    
    return 'AI-generated groundwater advisory for your region.'


def create_response(status_code, body):
    """Create standardized HTTP response with CORS headers"""
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

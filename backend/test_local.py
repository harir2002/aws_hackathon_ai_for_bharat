"""
Local testing script for Lambda handler
Run this to test the Lambda function without deploying to AWS
"""

import json
import sys
import os

# Add lambda directory to path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'lambda'))

# Mock AWS services for local testing
os.environ['AWS_REGION'] = 'us-east-1'
os.environ['DYNAMODB_TABLE'] = 'wise-drop-advisories'
os.environ['S3_BUCKET'] = 'wise-drop-data'
os.environ['BEDROCK_MODEL_ID'] = 'anthropic.claude-3-sonnet-20240229-v1:0'

def test_lambda():
    """Test the Lambda handler with sample input"""
    from handler import lambda_handler
    
    # Test cases for each role
    test_cases = [
        {
            'name': 'Farmer Advisory',
            'event': {
                'body': json.dumps({
                    'role': 'farmer',
                    'state': 'Karnataka',
                    'district': 'Bangalore'
                })
            }
        },
        {
            'name': 'Village Officer Advisory',
            'event': {
                'body': json.dumps({
                    'role': 'officer',
                    'state': 'Maharashtra',
                    'district': 'Pune'
                })
            }
        },
        {
            'name': 'Policy Maker Advisory',
            'event': {
                'body': json.dumps({
                    'role': 'policymaker',
                    'state': 'Tamil Nadu',
                    'district': 'Chennai'
                })
            }
        }
    ]
    
    print("=" * 60)
    print("Testing Wise Drop Lambda Handler Locally")
    print("=" * 60)
    print("\nNote: This will use mock data since AWS services aren't configured")
    print("To test with real AWS services, configure your AWS credentials\n")
    
    for test in test_cases:
        print(f"\n{'=' * 60}")
        print(f"Test: {test['name']}")
        print(f"{'=' * 60}")
        
        try:
            result = lambda_handler(test['event'], None)
            print(f"Status Code: {result['statusCode']}")
            
            body = json.loads(result['body'])
            if 'advice' in body:
                print(f"\nAdvice Generated:\n{body['advice']}")
            elif 'error' in body:
                print(f"\nError: {body['error']}")
                
        except Exception as e:
            print(f"Error during test: {str(e)}")

if __name__ == '__main__':
    test_lambda()

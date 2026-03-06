# Wise Drop - AI-Powered Groundwater Intelligence Platform

## Problem Statement

Groundwater depletion is a critical challenge affecting millions of farmers, communities, and policymakers across India. Different stakeholders need different insights from the same groundwater data:

- **Farmers** need simple, actionable irrigation advice
- **Village Officers** need operational risk assessments
- **Policy Makers** need strategic, data-driven insights

Traditional systems provide generic reports that don't address role-specific needs. Wise Drop solves this using **agentic AI** to deliver personalized, context-aware groundwater intelligence.

## Why AI is Required

1. **Personalization**: Different roles need different communication styles and insights from the same data
2. **Complexity Reduction**: AI translates technical groundwater data into actionable advice
3. **Scalability**: One system serves multiple stakeholder types without manual customization
4. **Real-time Intelligence**: AI generates fresh insights on-demand rather than static reports

## Three-Agent Architecture

Wise Drop implements a **multi-agent system** where each agent specializes in serving a specific role:

### 🌾 Farmer Agent
- **Purpose**: Provide actionable irrigation and crop guidance
- **Tone**: Friendly, non-technical, action-oriented
- **Output**: Simple water conservation tips, irrigation timing, crop selection advice

### 🏘️ Village Officer Agent
- **Purpose**: Deliver operational groundwater risk assessments
- **Tone**: Semi-technical, structured, operational
- **Output**: Risk summaries, priority interventions, community recommendations

### 🏛️ Policy Maker Agent
- **Purpose**: Generate strategic policy insights
- **Tone**: Formal, data-driven, strategic
- **Tone**: Long-term trends, sustainability risks, policy recommendations

### Agent Orchestrator (Lambda)
The Lambda function acts as the **orchestrator** that:
1. Receives user requests (role, state, district)
2. Fetches groundwater data from S3
3. Routes to the appropriate agent
4. Invokes Amazon Bedrock with role-specific prompts
5. Stores responses in DynamoDB
6. Returns personalized advice

## AWS Services Used

| Service | Purpose |
|---------|---------|
| **Amazon Bedrock** | GenAI model (Claude 3 Sonnet) for generating role-specific advice |
| **AWS Lambda** | Serverless compute for agent orchestrator |
| **Amazon API Gateway** | REST API endpoint for frontend-backend communication |
| **Amazon S3** | Storage for groundwater datasets |
| **Amazon DynamoDB** | NoSQL database for storing generated advisories |

## Architecture Diagram

```
User (Browser)
    ↓
React Frontend (Vite)
    ↓
API Gateway (POST /advisory)
    ↓
Lambda (Agent Orchestrator)
    ├→ S3 (Groundwater Data)
    ├→ Bedrock (AI Generation)
    └→ DynamoDB (Store Response)
    ↓
Return Advice to User
```

## Project Structure

```
wise-drop/
├── frontend/                 # React application
│   ├── src/
│   │   ├── App.jsx          # Main UI component
│   │   ├── api.js           # API integration
│   │   ├── main.jsx         # React entry point
│   │   └── styles.css       # Styling
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
├── backend/                  # Python Lambda
│   ├── lambda/
│   │   └── handler.py       # Agent orchestrator
│   ├── prompts/             # Role-specific prompts
│   │   ├── farmer_prompt.txt
│   │   ├── officer_prompt.txt
│   │   └── policymaker_prompt.txt
│   └── requirements.txt
└── README.md
```

## How to Run Frontend Locally

1. Navigate to frontend directory:
```bash
cd wise-drop/frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file (optional, for local API testing):
```
VITE_API_ENDPOINT=http://localhost:3000/advisory
```

4. Start development server:
```bash
npm run dev
```

5. Open browser at `http://localhost:5173`

## How to Test Backend Locally (Optional)

If you want to test the Lambda function locally before deploying:

1. Navigate to backend directory:
```bash
cd wise-drop/backend
```

2. Create a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Set environment variables:
```bash
export AWS_REGION=us-east-1
export DYNAMODB_TABLE=wise-drop-advisories
export S3_BUCKET=wise-drop-data
export BEDROCK_MODEL_ID=anthropic.claude-3-sonnet-20240229-v1:0
```

5. Test with Python:
```python
from lambda.handler import lambda_handler
event = {
    'body': '{"role": "farmer", "state": "Karnataka", "district": "Bangalore"}'
}
result = lambda_handler(event, None)
print(result)
```

**Note**: For AWS Lambda deployment, `boto3` is pre-installed in the runtime, so you only need to package your `handler.py` file.

## How Lambda + API Works

### Request Flow

1. **User Input**: User selects role, state, district and clicks "Generate Advisory"

2. **API Call**: Frontend sends POST request to API Gateway:
```json
{
  "role": "farmer",
  "state": "Karnataka",
  "district": "Bangalore"
}
```

3. **Lambda Processing**:
   - Validates input
   - Fetches groundwater data from S3 (or uses mock data)
   - Loads role-specific prompt template
   - Calls Amazon Bedrock with formatted prompt
   - Stores response in DynamoDB

4. **Response**: Returns AI-generated advice:
```json
{
  "advice": "Based on current groundwater levels in Bangalore..."
}
```

### Lambda Environment Variables

Set these in Lambda configuration:

```
AWS_REGION=us-east-1
DYNAMODB_TABLE=wise-drop-advisories
S3_BUCKET=wise-drop-data
BEDROCK_MODEL_ID=anthropic.claude-3-sonnet-20240229-v1:0
```

## AWS Deployment Steps

### 1. Deploy Lambda Function

**Important**: boto3 is pre-installed in AWS Lambda, so you only need to package your handler.py

```bash
cd wise-drop/backend/lambda
zip -r function.zip handler.py

# Create Lambda function
aws lambda create-function \
  --function-name wise-drop-orchestrator \
  --runtime python3.11 \
  --role arn:aws:iam::YOUR_ACCOUNT:role/lambda-execution-role \
  --handler handler.lambda_handler \
  --zip-file fileb://function.zip \
  --timeout 30 \
  --memory-size 512 \
  --environment Variables="{DYNAMODB_TABLE=wise-drop-advisories,S3_BUCKET=wise-drop-data,BEDROCK_MODEL_ID=anthropic.claude-3-sonnet-20240229-v1:0}"
```

If you need additional packages (not boto3), create a deployment package:
```bash
cd wise-drop/backend
pip install -r requirements.txt -t lambda/
cd lambda
zip -r function.zip .
```

### 2. Create DynamoDB Table

```bash
aws dynamodb create-table \
  --table-name wise-drop-advisories \
  --attribute-definitions AttributeName=id,AttributeType=S \
  --key-schema AttributeName=id,KeyType=HASH \
  --billing-mode PAY_PER_REQUEST
```

### 3. Create S3 Bucket

```bash
aws s3 mb s3://wise-drop-data
```

### 4. Setup API Gateway

1. Create REST API
2. Create POST method on `/advisory` resource
3. Integrate with Lambda function
4. Enable CORS
5. Deploy to stage (e.g., `prod`)

### 5. Update Frontend

Update `frontend/src/api.js` with your API Gateway URL:
```javascript
const API_ENDPOINT = 'https://YOUR_API_ID.execute-api.us-east-1.amazonaws.com/prod/advisory'
```

### 6. Build and Deploy Frontend

```bash
cd wise-drop/frontend
npm run build
aws s3 sync dist/ s3://wise-drop-frontend --acl public-read
```

## IAM Permissions Required

Lambda execution role needs:
- `bedrock:InvokeModel`
- `dynamodb:PutItem`
- `s3:GetObject`
- `logs:CreateLogGroup`, `logs:CreateLogStream`, `logs:PutLogEvents`

## Testing the Application

1. Open the frontend
2. Select "Farmer" role
3. Enter "Karnataka" for state
4. Enter "Bangalore" for district
5. Click "Generate Advisory"
6. Observe AI-generated, farmer-specific advice

Repeat with "Village Officer" and "Policy Maker" roles to see different agent outputs.

## Demo Talking Points

1. **Problem**: Groundwater data is complex; different stakeholders need different insights
2. **Solution**: Agentic AI with three specialized agents
3. **Tech**: Serverless AWS architecture with Amazon Bedrock
4. **Value**: Personalized, explainable, role-specific intelligence at scale

## Future Enhancements

- Real groundwater datasets from government APIs
- Historical trend analysis
- Multi-language support
- SMS/WhatsApp integration for farmers
- Geospatial visualization

## License

MIT License - Built for Hackathon

---

**Built with ❤️ for sustainable groundwater management**

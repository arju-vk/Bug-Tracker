# Vercel Deployment Guide for Bug Tracker

This guide will walk you through deploying your Bug Tracker application to Vercel.

## Prerequisites

1. **Vercel Account**: Sign up at https://vercel.com
2. **GitHub/GitLab/Bitbucket**: Your code should be pushed to a Git repository
3. **MongoDB Atlas Account**: You need a cloud MongoDB database

## Step 1: Create MongoDB Atlas Database

If you don't have a MongoDB Atlas account:

1. Go to https://www.mongodb.com/cloud/atlas
2. Sign up for a free account
3. Create a free cluster (choose AWS as provider, select a region near you)
4. Create a database user (remember the username and password)
5. In Network Access, add IP address `0.0.0.0/0` (allows access from anywhere)
6. Get your connection string:
   - Click "Connect" → "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your database user's password
   - Replace `<dbname>` with "bugtracker"

## Step 2: Push Code to Git

1. Initialize git if not already done:

```
bash
   git init
   git add .
   git commit -m "Prepare for Vercel deployment"

```

2. Push to your GitHub/GitLab/Bitbucket repository

## Step 3: Deploy to Vercel

### Option A: Deploy from Vercel Dashboard

1. Go to https://vercel.com and sign in
2. Click "Add New..." → "Project"
3. Import your Git repository
4. Configure the project:
   - Framework Preset: Other
   - Build Command: (leave empty for now)
   - Output Directory: (leave empty for now)
5. Click "Deploy"

### Option B: Deploy using Vercel CLI

```
bash
npm install -g vercel
vercel login
vercel
```

## Step 4: Configure Environment Variables

After deploying, you need to set up environment variables:

1. Go to your project in Vercel dashboard
2. Click on "Settings" → "Environment Variables"
3. Add the following variables:

| Variable       | Value                                                                                                     |
| -------------- | --------------------------------------------------------------------------------------------------------- |
| `MONGODB_URI`  | Your MongoDB Atlas connection string (e.g., `mongodb+srv://user:password@cluster.mongodb.net/bugtracker`) |
| `JWT_SECRET`   | A random string for JWT tokens (e.g., `your-super-secret-key-12345`)                                      |
| `VITE_API_URL` | Your API URL (e.g., `https://your-project.vercel.app/api`)                                                |

4. Click "Save"

## Step 5: Redeploy

After adding environment variables:

1. Go to "Deployments" in Vercel
2. Click the latest deployment
3. Click "Redeploy"

## Step 6: Verify Deployment

Once deployed:

1. Visit your Vercel URL (e.g., `https://your-project.vercel.app`)
2. Test the API health endpoint: `https://your-project.vercel.app/api/health`
3. Register a new account and create a project/ticket

## Project Structure for Vercel

```
bug-tracker/
├── backend/
│   ├── api/              # Vercel API routes
│   │   ├── index.js       # Main API entry point
│   │   ├── auth.js       # Authentication routes
│   │   ├── projects.js   # Projects routes
│   │   ├── tickets.js    # Tickets routes
│   │   └── comments.js   # Comments routes
│   ├── models/           # Mongoose models
│   ├── vercel.json       # Vercel config for backend
│   └── package.json
├── frontend/
│   ├── src/              # React source code
│   ├── vercel.json       # Vercel config for frontend
│   └── package.json
├── vercel.json           # Root Vercel config
└── README.md
```

## Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Check that MONGODB_URI is correctly set
   - Verify MongoDB Atlas network access allows all IPs

2. **API Returns 404**
   - Ensure vercel.json routes are correct
   - Check that all API routes are properly exported

3. **Frontend Not Loading**
   - Verify the build completed successfully
   - Check that SPA routing is handled

### Local Development

To run locally after these changes:

```
bash
# Install dependencies
cd backend && npm install
cd ../frontend && npm install

# Start backend (for testing API)
cd backend
npm run vercel-dev

# In another terminal, start frontend
cd frontend
npm run dev
```

## Notes

- The backend runs as Vercel Serverless Functions
- Each API route is processed as a separate function
- Cold starts may cause slight delays on first request
- For production, consider upgrading to Vercel Pro for more resources

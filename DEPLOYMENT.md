# Deploying to CodeSandbox

Follow these steps to deploy the Deriv Trading Bot to CodeSandbox:

1. Go to https://codesandbox.io/
2. Click "Create Sandbox"
3. Choose "Import Project"
4. Upload all project files or use the GitHub repository URL

## Post-Deployment Steps

1. Once deployed, note your CodeSandbox URL (e.g., https://8v5m5c-3000.csb.app)

2. Register/Update Deriv API App:
   - Go to https://api.deriv.com
   - Log in to your Deriv account
   - Click "Register an app" or edit your existing app
   - Add your CodeSandbox URL as an allowed redirect URI
   - Note your App ID

3. Update API Configuration:
   - Open `src/services/DerivAPIService.js`
   - Verify that the `app_id` matches your Deriv API App ID
   - Verify that the redirect URI matches your CodeSandbox URL

4. Test OAuth Flow:
   - Open your CodeSandbox URL
   - Click any action that requires authentication
   - You should be redirected to Deriv login
   - After login, you should be redirected back to your app

## Troubleshooting

1. OAuth Redirect Issues:
   - Ensure the redirect URI in Deriv API settings exactly matches your CodeSandbox URL
   - Check that there are no trailing slashes in the URLs
   - Verify that the protocol (https://) is included

2. API Connection Issues:
   - Check browser console for WebSocket connection errors
   - Verify that your App ID is correct
   - Ensure you're using a secure WebSocket connection (wss://)

3. Dependencies Issues:
   - If you see module not found errors, try:
     - Delete the node_modules folder
     - Delete package-lock.json
     - Run `npm install` again

## Important Notes

- The CodeSandbox URL is permanent as long as you don't delete the sandbox
- You can fork the sandbox to create variations
- CodeSandbox automatically saves your changes
- You can share the sandbox URL with others for collaboration

## Security Considerations

- Never commit sensitive information like API keys
- Use environment variables for sensitive data
- Regularly rotate your API keys
- Monitor your app's usage in the Deriv API dashboard

## Testing

Before going live:
1. Test the OAuth flow multiple times
2. Verify that WebSocket connections are stable
3. Test all trading strategies with small amounts
4. Verify that error handling works as expected
5. Test the responsiveness of the UI

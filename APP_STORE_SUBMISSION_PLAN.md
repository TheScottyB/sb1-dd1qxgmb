# App Store Submission Plan - Play in the Sandbox Looking at Flowers

## Prerequisites (Already Completed)
- [x] Apple Developer Account (beilsco@gmail.com)
- [x] Team ID: 3X872JR6P3
- [x] App Store Connect App ID: 6477183822
- [x] Bundle ID: com.djscottyb.playsandbox

## 1. App Store Connect Setup
1. Login to App Store Connect (https://appstoreconnect.apple.com)
2. Verify app information:
   - App Name: "Play in the Sandbox Looking at Flowers"
   - Bundle ID: com.djscottyb.playsandbox
   - SKU: PLAYSANDBOX2024

## 2. Required Assets
- [ ] App Icon (1024x1024px PNG)
- [ ] Screenshots:
  - iPhone 6.7" Display (iPhone 14 Pro Max): 1290x2796px
  - iPhone 6.5" Display (iPhone 14 Plus): 1284x2778px
  - iPad Pro 12.9" Display: 2048x2732px
- [ ] App Preview Videos (optional)
- [ ] App Privacy Details
  - Data Collection Practices
  - Privacy Policy URL

## 3. App Store Listing Content
- [ ] App Description
- [ ] Keywords
- [ ] Support URL
- [ ] Marketing URL (optional)
- [ ] Copyright Information
- [ ] Contact Information
- [ ] Age Rating Documentation
- [ ] Price and Availability

## 4. Technical Requirements
- [x] Encryption Declaration (Already set in app.json)
- [ ] Push Notification Entitlements
- [ ] In-App Purchase Configuration
  - Subscription Products
  - One-time Donations

## 5. Build Submission Steps
1. Create production build:
   ```bash
   eas build --platform ios --profile production
   ```

2. Submit build to App Store:
   ```bash
   eas submit --platform ios
   ```

3. Monitor build processing in App Store Connect

## 6. App Review Preparation
- [ ] Test Account Credentials
  - Username: (to be created)
  - Password: (to be created)
- [ ] Demo Instructions
  - How to access all features
  - Test subscription flow
  - Test donation flow

## 7. Post-Submission Plan
1. Monitor App Review Status
2. Prepare for Potential Rejection
   - Common reasons:
     - Missing privacy declarations
     - Incomplete functionality
     - Poor performance
3. Launch Preparation
   - Marketing materials
   - Support system ready
   - Analytics tracking set up

## 8. Important Compliance Notes
1. Subscription Requirements:
   - Clear terms and conditions
   - Transparent pricing
   - Easy cancellation process
2. Privacy Requirements:
   - Clear data usage explanation
   - User data protection measures
   - GDPR/CCPA compliance

## Timeline
1. Day 1: Asset Preparation
   - Create screenshots
   - Finalize app icon
   - Write app description

2. Day 2: Store Listing Setup
   - Complete App Store Connect information
   - Configure pricing
   - Set up privacy details

3. Day 3: Technical Submission
   - Generate production build
   - Submit to App Store
   - Provide test account

4. Days 4-7: Review Period
   - Monitor submission status
   - Be ready for expedited responses

## Command Reference
```bash
# Generate production build
eas build --platform ios --profile production

# Submit to App Store
eas submit --platform ios

# Check build status
eas build:list

# View build logs
eas build:view
```

## Contact Information
- Apple Developer Support: https://developer.apple.com/contact/
- App Review Team Contact: https://developer.apple.com/app-store/review/
- Your Apple Team ID: 3X872JR6P3

## Emergency Checklist
If app is rejected:
1. Read rejection reason carefully
2. Address all points in the rejection
3. Document changes made
4. Resubmit with detailed notes
5. Request expedited review if necessary

Remember: Keep all credentials and access tokens secure and never include them in the app's source code.

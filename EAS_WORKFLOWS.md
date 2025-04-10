# EAS Workflows

This document explains how to use EAS Workflows to automate build, submit, and update processes for this application.

## Available Workflows

### iOS Production Build
Automatically builds the iOS app for production when code is pushed to the main branch.
```
eas workflow:run build-ios-production.yml
```

### Android Production Build
Automatically builds the Android app for production when code is pushed to the main branch.
```
eas workflow:run build-android-production.yml
```

### Submit iOS
Submits an iOS app to the App Store when code is pushed to the main branch.
```
eas workflow:run submit-ios.yml
```

### Build and Submit iOS
Builds and submits the iOS app to the App Store when code is pushed to the release branch.
```
eas workflow:run build-and-submit-ios.yml
```

### Test and Build
Runs tests and builds preview versions for both iOS and Android when a pull request is created against the main branch.
```
eas workflow:run test-and-build.yml
```

### Publish Update
Sends an over-the-air update when code is pushed to any branch. The update will be published to a channel that matches the branch name.
```
eas workflow:run publish-update.yml
```

### Update Production
Updates the production app when code is pushed to the production branch.
```
eas workflow:run update-production.yml
```

## Setup Requirements

1. Link your GitHub repository to your EAS project:
   - Navigate to your project's GitHub settings
   - Follow the UI to install the GitHub app
   - Select this GitHub repository and connect it

2. All workflow files are configured in the `.eas/workflows/` directory

## Running Workflows Manually

You can manually trigger any workflow using the EAS CLI:

```
eas workflow:run <workflow-file.yml>
```

For example:
```
eas workflow:run build-ios-production.yml
```

## Workflow Types Reference

| Type | Description |
|------|-------------|
| `build` | Creates app builds (iOS/Android) |
| `submit` | Submits builds to app stores |
| `update` | Creates and publishes updates to EAS Update |
| `test` | Runs custom test scripts |

## Common Examples

### Building with different profiles
```yaml
build_development:
  name: Build Development
  type: build
  params:
    platform: ios
    profile: development
```

### Submitting to stores
```yaml
submit_ios:
  name: Submit iOS
  needs: build
  type: submit
  params:
    platform: ios
    profile: production
```

### Publishing updates
```yaml
update:
  name: Update Production
  type: update
  params:
    channel: production
    message: "Bug fixes and performance improvements"
```

### Running custom scripts
```yaml
test:
  name: Run Tests
  type: test
  script: |
    npm ci
    npm test
```
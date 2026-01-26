
```markdown
# Review Reminder GitHub Action

This GitHub Action helps manage pull request reviews by automatically reminding reviewers who have not yet provided feedback. The action runs daily or can be triggered on demand, ensuring timely reviews and enhancing collaboration within your team.

## Features

- **Automatic Reminder**: Sends a reminder to reviewers who haven't submitted feedback after 24 hours, then again after 3 days.
- **Daily Checks**: Scheduled to check for open pull requests every day.
- **Customizable**: Easy to configure based on your repository needs.

## Project Structure

```
.
├── src/
│   └── reminder.js           # Main reminder script
├── tests/
│   └── reminder.test.js      # Local test suite
├── config/
│   └── eslint.config.js      # ESLint configuration
├── .github/
│   └── workflows/
│       └── pr-reminder.yml   # GitHub Actions workflow
├── .husky/
│   └── pre-commit            # Pre-commit hooks
└── package.json              # Dependencies and scripts
```

## Getting Started

To use this action in your GitHub repository, follow these steps:

### 1. Clone the Repository

```bash
git clone https://github.com/mtzanida/review-reminder-github-action.git
cd review-reminder-github-action
```

### 2. Local Development Setup

Install dependencies and set up pre-commit hooks:

```bash
npm install
npx husky init
```

Run tests locally:

```bash
npm test
```

Run linting:

```bash
npm run lint
```

### 3. Set Up the GitHub Action

Create a workflow file in your repository's `.github/workflows` directory. You can name it `pr-reminder.yml`.

```yaml
name: PR Reminder

on:
  schedule:
    - cron: "0 0 * * *"  # Runs daily at midnight
  workflow_dispatch:

permissions:
  contents: read
  pull-requests: write

jobs:
  reminder:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout repository
        uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: "20"
      
      - name: Install dependencies
        run: npm install @octokit/rest
      
      - name: Run reminder script
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        run: node src/reminder.js
```

### 4. Add the Reminder Script

Place the script located at `src/reminder.js` in your repository. This script handles fetching open pull requests, identifying reviewers, and posting reminders.

### 5. Configure GitHub Token

Make sure to create a GitHub token and add it to your repository secrets as `GITHUB_TOKEN`. This is necessary for the action to authenticate API requests.

## Testing

### Local Testing

The project includes a local test suite that simulates the reminder logic without making actual API calls.

**Run tests:**
```bash
npm test
```

**What the test does:**
- Creates mock PRs with different ages (25 hours old, 4 days old)
- Simulates the reminder logic for each PR
- Verifies that reminders are sent at the correct intervals:
  - First reminder: After 24 hours
  - Second reminder: After 3 days (if first reminder was already sent)

**Example output:**
```
🧪 Running local test...

PR #1: Test PR - 25 hours old
  Age: 1.0 days
  ✅ First reminder would be sent to @test-reviewer

PR #2: Test PR - 4 days old
  Age: 4.0 days
  ✅ Second reminder would be sent to @test-reviewer

✅ Test completed successfully!
```

### Pre-commit Hooks

The project uses Husky to run automated checks before each commit:
- **Linting**: Ensures code quality with ESLint
- **Testing**: Runs the test suite to verify logic

These checks run automatically when you commit. To bypass (not recommended):
```bash
git commit --no-verify
```

## Usage

Once the action is set up, it will automatically check for open pull requests and send reminders to reviewers who haven't provided feedback within 24 hours, and again after 3 days.

### Example of Reminder Message

When a reminder is sent, it will mention the reviewer in the pull request comment, like so:

```
Hi @reviewer, don't forget to check this PR.
```

## Contributing

Contributions are welcome! If you have suggestions or improvements, feel free to open an issue or submit a pull request.


## Acknowledgements

- [Octokit](https://github.com/octokit/octokit.js) for GitHub API interaction.

## Contact

For questions or suggestions, please open an issue or contact me via GitHub.

```


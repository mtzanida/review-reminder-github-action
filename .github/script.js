#!/usr/bin/env node

const { Octokit } = require("@octokit/rest");
const [owner, repo] = process.env.GITHUB_REPOSITORY.split("/");

const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });

async function run() {
  console.log("Fetching open pull requests...");
  const { data: prs } = await octokit.pulls.list({ owner, repo, state: "open" });
  console.log("Open pull requests fetched:", prs.length);

  for (const pr of prs) {
    console.log(`Processing pull request #${pr.number}...`);
    
    const hoursSinceCreated = (Date.now() - new Date(pr.created_at)) / (1000 * 60 * 60);
    
    if (hoursSinceCreated < 1) continue;

    const { data: reviews } = await octokit.pulls.listReviews({ owner, repo, pull_number: pr.number });
    const { data: { users: requestedReviewers } } = await octokit.pulls.listRequestedReviewers({ owner, repo, pull_number: pr.number });

    const reviewers = new Set(reviews.map(r => r.user.login));
    const reviewersWhoHaventReviewed = requestedReviewers.filter(u => !reviewers.has(u.login));

    console.log(`Reviewers who haven't reviewed PR #${pr.number}:`, reviewersWhoHaventReviewed.map(u => u.login));

    for (const reviewer of reviewersWhoHaventReviewed) {
      await octokit.issues.createComment({
        owner,
        repo,
        issue_number: pr.number,
        body: `Hi @${reviewer.login}, don't forget to check this PR.`,
      });
    }
  }
}

run().catch(console.error);

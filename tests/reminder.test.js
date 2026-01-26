#!/usr/bin/env node

const { Octokit } = require("@octokit/rest");

// Mock data for local testing
const mockPRs = [
  {
    number: 1,
    created_at: new Date(Date.now() - 25 * 60 * 60 * 1000).toISOString(), // 25 hours ago
    title: "Test PR - 25 hours old"
  },
  {
    number: 2,
    created_at: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(), // 4 days ago
    title: "Test PR - 4 days old"
  }
];

const mockReviews = [];
const mockRequestedReviewers = { users: [{ login: "test-reviewer" }] };
const mockComments = [];

console.log("🧪 Running local test...\n");

// Test the reminder logic
for (const pr of mockPRs) {
  const hoursSinceCreated = (Date.now() - new Date(pr.created_at)) / (1000 * 60 * 60);
  const daysSinceCreated = hoursSinceCreated / 24;
  
  console.log(`PR #${pr.number}: ${pr.title}`);
  console.log(`  Age: ${daysSinceCreated.toFixed(1)} days`);
  
  if (hoursSinceCreated < 24) {
    console.log(`  ⏳ Too new, skipping\n`);
    continue;
  }

  const reviewers = new Set(mockReviews.map(r => r.user.login));
  const reviewersWhoHaventReviewed = mockRequestedReviewers.users.filter(u => !reviewers.has(u.login));
  
  for (const reviewer of reviewersWhoHaventReviewed) {
    const reminderComments = mockComments.filter(c => 
      c.body.includes(`@${reviewer.login}`) && c.body.includes("don't forget to check this PR")
    );
    
    const shouldRemind = reminderComments.length === 0 
      ? daysSinceCreated >= 1
      : daysSinceCreated >= 3;

    if (shouldRemind) {
      const reminderType = reminderComments.length === 0 ? "First" : "Second";
      console.log(`  ✅ ${reminderType} reminder would be sent to @${reviewer.login}\n`);
    } else {
      console.log(`  ⏸️  No reminder needed yet\n`);
    }
  }
}

console.log("✅ Test completed successfully!");

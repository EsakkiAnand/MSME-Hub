# Server-Side GitHub Token and Repository Tree Caching

To circumvent GitHub's strict 60 requests/hour unauthenticated IP rate limit, MSME-Hub routes all repository tree, commit history, and README requests through a centralized server-side GitHub Personal Access Token or GitHub App. Responses are cached with a 5-minute time-to-live (TTL) in the application data layer, ensuring sub-second dashboard rendering and preventing third-party API exhaustion during team reviews.

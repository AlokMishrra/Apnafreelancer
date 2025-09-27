// Chatbot knowledge base for common questions about Apna Freelancer platform
// This can be expanded with more detailed information as needed

type KnowledgeEntry = {
  keywords: string[];
  response: string;
};

export const chatbotKnowledge: KnowledgeEntry[] = [
  {
    keywords: ['hire', 'find freelancer', 'hiring', 'recruit'],
    response: `To hire a freelancer on ApnaFreelancer:
1. Browse the "Hire Talent" page to explore available freelancers
2. Use filters to narrow down by skills, experience, and budget
3. View freelancer profiles, portfolios and reviews
4. Contact promising candidates through our messaging system
5. Discuss project details, timeline and payment terms
6. Create a contract through our platform to protect both parties
7. Release payment upon satisfactory completion of work

Alternatively, you can post a specific job on the "Post a Job" page and let qualified freelancers come to you with proposals.`
  },
  {
    keywords: ['create service', 'offer service', 'sell service', 'become freelancer'],
    response: `To create a service on ApnaFreelancer:
1. Sign up or log in to your account
2. Navigate to your dashboard and click on "Create a Service"
3. Fill out the service details including:
   - Title and description
   - Category and subcategory
   - Pricing options (Basic, Standard, Premium)
   - Delivery timeframe
   - Number of revisions included
   - Required skills and expertise
4. Add high-quality images showcasing your work
5. Set clear expectations about what clients will receive
6. Submit your service for review by our team
7. Once approved, your service will be visible to potential clients

Pro tip: Be specific about your expertise and the value you provide to stand out from other freelancers!`
  },
  {
    keywords: ['payment', 'pay', 'transaction', 'money', 'wallet', 'withdraw'],
    response: `ApnaFreelancer provides a secure payment system that protects both clients and freelancers:

For clients:
- Funds are held in escrow until project completion
- Release payments only after reviewing and approving work
- Multiple payment methods including credit/debit cards and bank transfers
- Transparent pricing with no hidden fees

For freelancers:
- Secure payment guarantee before starting work
- Milestone payments for larger projects
- Withdraw earnings to your bank account or digital wallet
- Payment protection in case of disputes

Our platform handles the payment process to ensure security and trust between both parties. Service fees are transparently displayed during the transaction.`
  },
  {
    keywords: ['fee', 'commission', 'charges', 'pricing'],
    response: `ApnaFreelancer charges the following fees:

1. Service Fee: 10% of the total transaction amount
   - 8% paid by freelancers
   - 2% paid by clients

2. Withdrawal Fee:
   - Bank transfers: ₹50 per withdrawal
   - Digital wallets: 1% of withdrawal amount

3. Currency Conversion: 2% if currencies need conversion

The service fee helps us maintain the platform, provide customer support, secure payment processing, and develop new features to improve your experience.

We believe in transparent pricing with no hidden fees or charges.`
  },
  {
    keywords: ['account', 'sign up', 'register', 'login', 'create account'],
    response: `Creating an account on ApnaFreelancer is quick and easy:

1. Click "Join Now" in the navigation bar
2. Enter your email address and create a password
3. Choose your account type:
   - Client (if you're hiring)
   - Freelancer (if you're offering services)
   - Both (to access all features)
4. Complete your profile with:
   - Personal information
   - Professional skills
   - Portfolio samples (for freelancers)
   - Payment information (for clients)
5. Verify your email address
6. Start using ApnaFreelancer!

Your account gives you access to our messaging system, project management tools, secure payments, and our supportive community.`
  },
  {
    keywords: ['profile', 'portfolio', 'bio', 'improve profile'],
    response: `Building a strong profile on ApnaFreelancer is essential for success:

For Freelancers:
1. Use a professional profile photo
2. Write a compelling bio highlighting your expertise and experience
3. Showcase your best work samples in your portfolio
4. List all relevant skills and certifications
5. Set competitive rates based on your skill level
6. Request reviews from previous clients
7. Complete skill assessments to verify your abilities

For Clients:
1. Provide company details and information
2. Maintain a good payment history
3. Leave fair and constructive feedback
4. Build a reputation as a reliable client

A complete profile builds trust and increases your chances of successful connections on the platform.`
  },
  {
    keywords: ['review', 'rating', 'feedback', 'stars'],
    response: `Ratings and reviews are the backbone of trust on ApnaFreelancer:

How it works:
1. After project completion, both parties can leave reviews
2. Ratings are on a 1-5 star scale
3. Written feedback provides detailed context
4. Reviews appear on user profiles
5. Overall rating is calculated as an average of all reviews

The review system helps:
- Clients choose reliable freelancers
- Freelancers build their reputation
- Maintain quality standards across the platform
- Provide accountability for all users

We encourage honest, constructive feedback that helps our community grow and improve.`
  },
  {
    keywords: ['dispute', 'problem', 'issue', 'conflict', 'resolution', 'help'],
    response: `If you encounter issues on ApnaFreelancer, we're here to help:

For payment or service disputes:
1. First, try to resolve the issue directly through our messaging system
2. If that doesn't work, open a dispute through our Resolution Center
3. Provide all relevant details and evidence
4. Our support team will review the case within 24-48 hours
5. We'll mediate and help reach a fair resolution
6. If necessary, we can release or refund escrow payments

For technical issues:
1. Check our Help Center for common solutions
2. Contact our support team via chat or email
3. Provide screenshots and details about the problem

We're committed to maintaining a fair, professional platform for everyone.`
  },
  {
    keywords: ['how it works', 'process', 'steps', 'guide'],
    response: `How ApnaFreelancer works:

For Clients:
1. Post a job or browse freelancer services
2. Review proposals or contact service providers
3. Discuss project details and expectations
4. Agree on terms and create a contract
5. Fund the project escrow
6. Review completed work
7. Release payment and leave feedback

For Freelancers:
1. Create a professional profile
2. Offer services or submit proposals to job posts
3. Communicate with potential clients
4. Agree on project scope and payment
5. Complete the work within the agreed timeframe
6. Deliver high-quality results
7. Receive payment and ask for reviews

Our platform streamlines the entire freelancing process from connection to payment, ensuring a smooth experience for everyone.`
  },
  {
    keywords: ['contact', 'support', 'help center'],
    response: `Need to contact ApnaFreelancer support? We're always here to help!

Ways to reach us:
1. Email: support@apnafreelancer.com
2. Live Chat: Available 24/7 through this chatbot or website
3. Help Center: Comprehensive guides and FAQs at help.apnafreelancer.com
4. Phone: +91-8800-APNA-FL (Available Mon-Fri, 9AM-6PM IST)
5. Social Media: Message us on Twitter or Facebook @ApnaFreelancer

For fastest response, please include:
- Your username
- Order/project ID (if applicable)
- Clear description of your issue
- Screenshots (if relevant)

We aim to respond to all inquiries within 24 hours.`
  },
  {
    keywords: ['learning', 'courses', 'skills', 'education', 'learn', 'roadmap'],
    response: `ApnaFreelancer offers learning resources to help you grow your skills:

1. Skill Development Roadmaps:
   - Personalized learning paths for in-demand skills
   - Track your progress and set goals
   - Interactive assessments to test your knowledge

2. Free Resources:
   - Blog articles and tutorials
   - Webinars and live Q&A sessions
   - Community forums to connect with peers

3. Premium Courses:
   - Industry-expert created content
   - Certification opportunities
   - Hands-on projects and exercises

Visit the "Learning" section in the navigation menu to explore all educational resources and start upskilling today!`
  },
  {
    keywords: ['secure', 'security', 'safe', 'protection', 'privacy'],
    response: `At ApnaFreelancer, your security and privacy are our top priorities:

How we keep you safe:
1. Secure Payment Protection:
   - All transactions processed through our escrow system
   - Bank-level encryption for financial data
   - Regular security audits and compliance checks

2. Account Security:
   - Two-factor authentication
   - Login alerts for suspicious activity
   - Regular password change reminders

3. Privacy Measures:
   - Control what information is public on your profile
   - Clear privacy settings for communications
   - Data protection compliance with global standards

4. Community Trust:
   - ID verification for freelancers
   - Transparent review system
   - Active monitoring for fraudulent activity

If you ever have security concerns, please contact our team immediately at security@apnafreelancer.com.`
  }
];

export function getResponseFromKnowledgeBase(query: string): string {
  const lowercaseQuery = query.toLowerCase();
  
  // Check if any knowledge entry matches the query
  for (const entry of chatbotKnowledge) {
    if (entry.keywords.some(keyword => lowercaseQuery.includes(keyword))) {
      return entry.response;
    }
  }
  
  // Default response if no match found
  return "I don't have specific information about that yet. For detailed help, you can contact our support team at support@apnafreelancer.com or browse our Help Center for more resources.";
}
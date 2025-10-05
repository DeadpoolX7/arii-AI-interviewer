export const Footer = () => {
  return (
    <footer className="border-t bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-4">AI Resume Interviewer</h3>
            <p className="text-muted-foreground">
              Practice technical interviews with AI-powered questions tailored to your resume and target role.
            </p>
          </div>

          <div>
            <h4 className="text-md font-medium text-foreground mb-4">Features</h4>
            <ul className="space-y-2 text-muted-foreground">
              <li>Resume-based questions</li>
              <li>Technical & behavioral interviews</li>
              <li>Instant AI feedback</li>
              <li>Performance tracking</li>
            </ul>
          </div>

          <div>
            <h4 className="text-md font-medium text-foreground mb-4">Support</h4>
            <ul className="space-y-2 text-muted-foreground">
              <li>Help Center</li>
              <li>Contact Us</li>
              <li>Privacy Policy</li>
              <li>Terms of Service</li>
            </ul>
          </div>
        </div>

        <div className="border-t mt-8 pt-8 text-center text-muted-foreground">
          <p>&copy; 2025 AI Resume Interviewer. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

import { Link } from "@tanstack/react-router";
import { Logo } from "@/components/Logo";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Button } from "@/components/ui/button";

export function PublicNav() {
  return (
    <header className="fixed top-0 inset-x-0 z-50 glass">
      <div className="max-w-7xl mx-auto px-4 lg:px-8 h-16 flex items-center justify-between">
        <Logo />
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-muted-foreground">
          <a href="#features" className="hover:text-foreground transition">Features</a>
          <a href="#how" className="hover:text-foreground transition">How it works</a>
          <a href="#testimonials" className="hover:text-foreground transition">Testimonials</a>
          <Link to="/doctor-apply" className="hover:text-foreground transition">For doctors</Link>
        </nav>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Link to="/login"><Button variant="ghost" size="sm">Sign in</Button></Link>
          <Link to="/register"><Button size="sm" className="bg-gradient-hero shadow-glow border-0">Get started</Button></Link>
        </div>
      </div>
    </header>
  );
}

export function PublicFooter() {
  return (
    <footer className="border-t bg-muted/30 mt-24">
      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-14 grid md:grid-cols-4 gap-10">
        <div>
          <Logo />
          <p className="text-sm text-muted-foreground mt-4 max-w-xs">
            Premium healthcare platform connecting patients with verified doctors worldwide.
          </p>
        </div>
        <div>
          <h4 className="text-sm font-semibold mb-3">Product</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><a href="#features" className="hover:text-foreground">Features</a></li>
            <li><Link to="/register" className="hover:text-foreground">Find a doctor</Link></li>
            <li><Link to="/doctor-apply" className="hover:text-foreground">Apply as doctor</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-semibold mb-3">Company</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><a className="hover:text-foreground" href="#">About</a></li>
            <li><a className="hover:text-foreground" href="#">Careers</a></li>
            <li><a className="hover:text-foreground" href="#">Press</a></li>
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-semibold mb-3">Legal</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><a className="hover:text-foreground" href="#">Privacy</a></li>
            <li><a className="hover:text-foreground" href="#">Terms</a></li>
            <li><a className="hover:text-foreground" href="#">HIPAA</a></li>
          </ul>
        </div>
      </div>
      <div className="border-t py-5 text-center text-xs text-muted-foreground">
        © 2026 MediConnect. Your health, beautifully connected.
      </div>
    </footer>
  );
}

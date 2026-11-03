import Logo from "@/assets/logo/skim-logo-svg.svg?react";
import WordMark from "@/assets/logo/skim-wordmark-svg.svg?react";

type AuthLayoutProps = {
  children: React.ReactNode;
};

const AuthLayout = ({ children }: AuthLayoutProps) => {
  return (
    <main className="skim-auth-shell">
      <div className="skim-auth-inner">
        <a href="/dashboard" className="skim-auth-brand" aria-label="Skim home">
          <span className="skim-auth-brand-mark"><Logo /></span>
          <WordMark className="skim-auth-wordmark" />
        </a>
        {children}
        <p className="skim-auth-footnote">Your documents, in context. · Skim</p>
      </div>
    </main>
  );
};

export default AuthLayout;
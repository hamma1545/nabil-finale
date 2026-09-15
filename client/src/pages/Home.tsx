import { useEffect, useState } from "react";
import {
  Facebook,
  GraduationCap,
  Instagram,
  Linkedin,
  Search,
  ShieldCheck,
  Twitter,
  Youtube,
} from "lucide-react";
import { findCertificate, type Certificate } from "@/lib/api";

const sampleCode = "204817563";

const certifications = [
  "Certified Data Scientist (CDS)",
  "Certified Data Engineer (CDE)",
  "Certified MLOps Engineer (CMOE)",
  "Certified Data Analyst (CDA)",
  "Artificial Intelligence Certified Executive",
  "Business Analytics for Managers",
  "Certified Data Scientist - Finance",
  "Certified Data Scientist - HR",
  "Certified Data Scientist - Marketing",
  "Certified Business Analytics Expert",
  "Certified Visual Analytics Expert",
  "Business Analytics Specialist Banking",
  "Business Analytics Specialist Agriculture",
  "Business Analytics Specialist Health Care",
  "Business Analytics Specialist Logistics",
  "Business Analytics Specialist Retail",
  "Certified Artificial Intelligence Expert",
  "Certified Computer Vision Expert",
];

const blogs = [
  "Choosing the Right Career",
  "Data Science vs Data Analytics",
  "Artificial Intelligence vs Data Science",
  "How to choose the Data Analytics Courses",
  "How to become a Data Scientist",
  "How to choose the Data Science Institute",
  "How to choose the Data Science Course",
  "A complete guide to Data Science",
  "A complete guide to Business Analytics",
  "A complete guide to Data Analytics",
  "A complete guide to Artificial Intelligence",
  "A complete guide to Data Engineering",
  "A complete guide to Machine Learning",
];

const quickLinks = [
  "Authorised Training Institutes",
  "Verify IABAC Certificate",
  "Guides & Standards",
  "IABAC Exam Portal",
  "Events",
  "FAQs",
];

const policies = [
  "Code of Conduct",
  "Certificate renewal",
  "Accreditation Terms and Conditions",
  "Privacy Policy",
];

function formatDate(value: string | null) {
  if (!value) return "Not provided";
  const [year, month, day] = value.split("-");
  return `${day}/${month}/${year}`;
}

function Brand() {
  return (
    <span className="classic-logo" aria-label="IABAC International Association of Business Analytics Certification">
      <img className="iabac-logo-image" src="/assets/iabac-logo.png" alt="IABAC International Association of Business Analytics Certification" />
    </span>
  );
}

function Header() {
  return (
    <>
      <div className="classic-utility">
        <div className="classic-utility-inner">
          <nav aria-label="Utility navigation">
            <a href="#about">About</a>
            <a href="#events">Events</a>
            <a href="#faqs">FAQs</a>
            <a href="#verify">Verify Certificate</a>
          </nav>
          <div className="classic-social" aria-label="Social links">
            <a href="#facebook" aria-label="Facebook"><Facebook size={12} /></a>
            <a href="#instagram" aria-label="Instagram"><Instagram size={12} /></a>
            <a href="#youtube" aria-label="YouTube"><Youtube size={12} /></a>
            <a href="#twitter" aria-label="Twitter"><Twitter size={12} /></a>
            <a href="#linkedin" aria-label="LinkedIn"><Linkedin size={12} /></a>
          </div>
        </div>
      </div>
      <header className="classic-main-nav">
        <div className="classic-nav-inner">
          <a href="/" className="classic-logo-link"><Brand /></a>
          <nav aria-label="Main navigation">
            <a className="active" href="/">Home</a>
            <a href="#about">About</a>
            <a href="#certifications">Certifications</a>
            <a href="#partners">Partners</a>
            <a href="#consulting">Consulting</a>
            <a href="#exam">My Exam</a>
            <a href="#blog">Blog</a>
          </nav>
        </div>
      </header>
    </>
  );
}

function Result({ certificate }: { certificate: Certificate }) {
  const isValid = certificate.status === "valid";
  return (
    <div className={`classic-result ${isValid ? "is-valid" : "is-invalid"}`} aria-live="polite">
      <div className="classic-result-title">
        <ShieldCheck size={22} />
        <div>
          <strong>{isValid ? "Certificate verified" : `Certificate ${certificate.status}`}</strong>
          <small>Official IABAC certificate record</small>
        </div>
        <span>{certificate.status}</span>
      </div>
      <div className="classic-result-grid">
        <div><small>Nom complet</small><strong>{certificate.full_name}</strong></div>
        <div><small>Numéro de passeport</small><strong>{certificate.passport_number}</strong></div>
        <div><small>Date de naissance</small><strong>{formatDate(certificate.date_of_birth)}</strong></div>
        <div><small>Type de formation</small><strong>{certificate.course_name}</strong></div>
        <div><small>Date du certificat</small><strong>{formatDate(certificate.issue_date)}</strong></div>
        <div><small>Statut</small><strong>{certificate.status}</strong></div>
      </div>
    </div>
  );
}

function FooterColumn({ title, items, anchor }: { title: string; items: string[]; anchor: string }) {
  return (
    <div>
      <h3>{title}</h3>
      {items.map((item) => <a href={`#${anchor}`} key={item}>›&nbsp; {item}</a>)}
    </div>
  );
}

export default function Home() {
  const [code, setCode] = useState("");
  const [result, setResult] = useState<Certificate | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [loading, setLoading] = useState(false);

  async function verify(value = code) {
    const normalized = value.replace(/\D/g, "").slice(0, 9);
    setCode(normalized);
    setResult(null);
    setNotFound(false);
    if (normalized.length !== 9) return;
    setLoading(true);
    try {
      const certificate = await findCertificate(normalized);
      if (certificate) setResult(certificate);
      else setNotFound(true);
    } catch {
      setNotFound(true);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const queryCode = new URLSearchParams(window.location.search).get("code");
    if (queryCode) void verify(queryCode);
  }, []);

  return (
    <div className="classic-site">
      <Header />
      <div className="classic-title-band">
        <div>
          <h1>Certificate Verification</h1>
          <span>HOME / CERTIFICATE VERIFICATION</span>
        </div>
      </div>
      <main>
        <section className="classic-verify" id="verify">
          <h2>To check the validity of a certificate, please follow the instructions below:</h2>
          <div className="classic-steps">
            <div className="classic-step">
              <span className="classic-step-icon"><GraduationCap size={24} /></span>
              <div><strong>Step 1:</strong><small>Type the Certificate Number as it appears on the certificate, i.e IAB112000AA</small></div>
            </div>
            <div className="classic-step">
              <span className="classic-step-icon"><GraduationCap size={24} /></span>
              <div><strong>Step 2:</strong><small>Click 'Submit'</small></div>
            </div>
          </div>
          <form className="classic-form" onSubmit={(event) => { event.preventDefault(); void verify(); }}>
            <div className="classic-input">
              <Search size={17} />
              <input
                value={code}
                onChange={(event) => setCode(event.target.value.replace(/\D/g, "").slice(0, 9))}
                placeholder="Enter your certificate number"
                inputMode="numeric"
                aria-label="Certificate number"
              />
              <span>{code.length}/9</span>
            </div>
            <button type="submit" disabled={loading || code.length !== 9}>{loading ? "Checking…" : "Submit"}<span>›</span></button>
          </form>
          <button className="classic-demo" onClick={() => void verify(sampleCode)}>Try sample certificate: <strong>{sampleCode}</strong></button>
          {result && <Result certificate={result} />}
          {notFound && (
            <div className="classic-error" role="alert">
              <strong>Certificate not found</strong>
              <p>The Certificate Number entered can not be verified. Please ensure that you have entered the Certificate Number correctly and if the problem persists contact <a href="mailto:exams@iabac.org">exams@iabac.org</a></p>
            </div>
          )}
        </section>

        <section className="classic-footer" id="about">
          <div className="classic-footer-inner">
            <div className="classic-footer-brand"><Brand /><p>Professional learning and certification, made clear.</p></div>
            <FooterColumn title="TOP CERTIFICATIONS" items={certifications} anchor="certifications" />
            <FooterColumn title="TRENDING BLOGS" items={blogs} anchor="blog" />
            <FooterColumn title="QUICK LINKS" items={quickLinks} anchor="links" />
            <div>
              <FooterColumn title="TERMS AND POLICIES" items={policies} anchor="policies" />
              <div className="classic-contact">
                <h3>CONTACT</h3>
                <a href="mailto:exams@iabac.org">Email: exams@iabac.org</a>
                <span>Phone no: +31 97 010280870</span>
                <span>Address: IABAC™ Center,<br />Waterlinie 101, 5656 NB,<br />Eindhoven, The Netherlands</span>
                <h3 className="payment-title">PAYMENT DETAILS</h3>
                <span>Bank Name: KNAB</span>
                <span>Account Name: IABAC B.V</span>
                <span>Account Number: 0604551940</span>
                <span>Swift Code: KNABNL2H</span>
                <span>IBAN: NL42KNAB</span>
                <span>Hoofddorp, The Netherlands</span>
              </div>
            </div>
          </div>
          <div className="classic-footer-bottom">
            <span>©2016 - 2026 IABAC. All rights reserved | IABAC KVK-number (Commercial Registration Number): 73234893</span>
            <span>IABAC®, IABAC logo, DSF®, CDS®, CAIE®, CNLPE®, CCVE®, CDSHR®, CDSFIN®, CVAE®, CDLE® and other certification marks are registered trademarks of IABAC B.V., The Netherlands.</span>
          </div>
        </section>
      </main>
    </div>
  );
}

export default function OrganizationJsonLd() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Mahrea",
    url: "https://mahrea.in",
    logo: "https://mahrea.in/images/logo.png",
    description:
      "Premium anti-tarnish jewellery designed for the everyday you, inspired by our roots.",
    sameAs: [
      "https://www.instagram.com/mahrea.in",
      "https://www.facebook.com/mahrea.in",
    ],
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer service",
      email: "hello@mahrea.in",
      availableLanguage: ["English", "Hindi"],
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

import { Helmet } from 'react-helmet-async';

const SITE_NAME = 'Kin Shop';
const BASE_URL = 'https://e-order.student-edu.online';
const DEFAULT_DESCRIPTION = 'Welcome to Kin Shop. Browse and order products online with ease at e-order.student-edu.online.';
const DEFAULT_IMAGE = `${BASE_URL}/og-image.svg`;

const ORGANIZATION_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Kin Shop',
  alternateName: 'Kin Shop Online Store',
  description: 'Welcome to Kin Shop. Browse and order products online with ease at e-order.student-edu.online.',
  url: BASE_URL,
  logo: DEFAULT_IMAGE,
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Phnom Penh',
    addressCountry: 'KH',
  },
  contactPoint: [
    {
      '@type': 'ContactPoint',
      telephone: '+855 883 996 258',
      contactType: 'customer service',
      availableLanguage: 'English',
      areaServed: 'KH',
    },
    {
      '@type': 'ContactPoint',
      email: 'kindoung7@gmail.com',
      contactType: 'customer service',
      availableLanguage: 'English',
    },
  ],
};

const SEO = ({
  title,
  description,
  image,
  url,
  type = 'website',
  noIndex = false,
  structuredData = null,
}) => {
  const fullTitle = title ? `${title} | ${SITE_NAME}` : `${SITE_NAME} | Official Online Store`;
  const fullUrl = url ? `${BASE_URL}${url}` : BASE_URL;
  const fullImage = image ? `${BASE_URL}${image}` : DEFAULT_IMAGE;
  const metaDescription = description || DEFAULT_DESCRIPTION;

  const schemaToInject = structuredData || ORGANIZATION_SCHEMA;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={metaDescription} />
      <link rel="canonical" href={fullUrl} />

      <meta property="og:type" content={type} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={metaDescription} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:image" content={fullImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={metaDescription} />
      <meta name="twitter:image" content={fullImage} />

      {noIndex && <meta name="robots" content="noindex, nofollow" />}

      <script type="application/ld+json">
        {JSON.stringify(schemaToInject)}
      </script>
    </Helmet>
  );
};

export default SEO;

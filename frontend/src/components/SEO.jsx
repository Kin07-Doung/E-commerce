import { Helmet } from 'react-helmet-async';

const SITE_NAME = 'Kin Shop';
const BASE_URL = 'https://e-order.student-edu.online';
const DEFAULT_DESCRIPTION = 'E-Order — Order delicious food online easily and conveniently.';
const DEFAULT_IMAGE = `${BASE_URL}/og-image.png`;

const SEO = ({
  title,
  description,
  image,
  url,
  type = 'website',
  noIndex = false,
  structuredData = null,
}) => {
  const fullTitle = title ? `${title} | ${SITE_NAME}` : SITE_NAME;
  const fullUrl = url ? `${BASE_URL}${url}` : BASE_URL;
  const fullImage = image ? `${BASE_URL}${image}` : DEFAULT_IMAGE;
  const metaDescription = description || DEFAULT_DESCRIPTION;

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

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={metaDescription} />
      <meta name="twitter:image" content={fullImage} />

      {noIndex && <meta name="robots" content="noindex, nofollow" />}

      {structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      )}
    </Helmet>
  );
};

export default SEO;

import { Helmet } from "react-helmet-async";

interface SeoProps {
  title: string;
  description: string;
  path?: string;
  image?: string;
}

const SITE = "https://isitholiday.today";

export default function Seo({ title, description, path = "/", image }: SeoProps) {
  const url = `${SITE}${path}`;
  const ogImage = image ?? `${SITE}/favicon.svg`;
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />
      <meta name="twitter:card" content="summary" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
    </Helmet>
  );
}

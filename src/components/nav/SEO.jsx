import Head from 'next/head';

export default function SEO({ title, description, robots, url, image }) {
  return (
    <Head>
      <title>{title}</title>
      <meta name='description' content={description} />
      {robots === true && <meta name='robots' content='index, follow' />}
      <meta httpEquiv='Content-Type' content='text/html; charset=utf-8' />
      <meta name='language' content='English' />
      <meta property='og:title' content={title} />
      <meta property='og:type' content='website' />
      <meta
        property='og:url'
        content={`${process.env.NEXT_PUBLIC_CLIENT}${url}`}
      />
      <meta property='og:site_name' content='Namcave' />
      <meta property='og:description' content={description} />
      {image ? (
        <meta property='og:image' content={image} />
      ) : (
        <meta property='og:image' content={'/images/Logo.png'} />
      )}
    </Head>
  );
}

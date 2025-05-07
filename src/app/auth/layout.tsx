export default function FullWidthPageLayout({
  children,
}: {
  children: React.ReactNode;


  //TODO: VALIDAR TOKEN DE SESION Y REDIRIGIR A /HOME
}) {
  return <div>{children}</div>;
}

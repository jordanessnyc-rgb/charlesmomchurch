import { ButtonLink } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="container-x py-24 text-center">
      <p className="kicker">404</p>
      <h1 className="mt-3 text-4xl font-semibold text-navy-800">Page not found · Página no encontrada</h1>
      <p className="mt-3 text-muted">The page you&apos;re looking for doesn&apos;t exist or has moved. · La página que buscas no existe o fue movida.</p>
      <div className="mt-8 flex justify-center gap-3">
        <ButtonLink href="/en" variant="navy">Home</ButtonLink>
        <ButtonLink href="/es" variant="outline">Inicio</ButtonLink>
      </div>
    </div>
  );
}

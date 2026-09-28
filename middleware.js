import { NextResponse } from 'next/server';

export function middleware(req) {
  const { pathname } = req.nextUrl;

  // 1. Proteger panel de administración con Basic Auth
  if (pathname.startsWith('/admin') || pathname.startsWith('/api/admin')) {
    const basicAuth = req.headers.get('authorization');

    if (basicAuth) {
      const authValue = basicAuth.split(' ')[1];
      const [user, pwd] = atob(authValue).split(':');

      if (
        user === process.env.ADMIN_USER &&
        pwd === process.env.ADMIN_PASS
      ) {
        return NextResponse.next();
      }
    }

    return new NextResponse('Authentication Required', {
      status: 401,
      headers: {
        'WWW-Authenticate': 'Basic realm="Secure Area"',
      },
    });
  }

  // 2. Proteger APIs sensibles de pipelines con un Token
  if (pathname.startsWith('/api/pipeline')) {
    const authHeader = req.headers.get('authorization');
    const expectedToken = process.env.PIPELINE_SECRET_KEY;

    if (!expectedToken) {
      // Si no hay key configurada, bloqueamos por seguridad
      return NextResponse.json({ error: 'Configuración incompleta en el servidor' }, { status: 500 });
    }

    if (!authHeader || authHeader !== `Bearer ${expectedToken}`) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*', '/api/pipeline/:path*'],
};

# Clothing Store - E-commerce Shop

## Configuración Inicial

### 1. Configurar Variables de Entorno

Crea un archivo `.env.local` en la raíz del proyecto con tus credenciales de Supabase:

```env
NEXT_PUBLIC_SUPABASE_URL=tu-url-de-supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-anon-key-de-supabase
```

Puedes copiar el archivo `env.example.txt` como plantilla.

### 2. Ejecutar Migración de Base de Datos

**IMPORTANTE**: Antes de ejecutar la migración, asegúrate de tener un backup de tu base de datos.

1. Ve a tu proyecto en Supabase Dashboard
2. Navega a SQL Editor
3. Abre el archivo `../supabase_migrations/create_customer_tables.sql`
4. Copia y pega el contenido en el SQL Editor
5. Ejecuta la migración

Esto creará las siguientes tablas:
- `customer_profiles` - Perfiles de clientes
- `online_orders` - Pedidos online
- `order_items_online` - Items de pedidos online

### 3. Instalar Dependencias y Ejecutar

```bash
npm install
npm run dev
```

La aplicación estará disponible en `http://localhost:3000`

## Estructura del Proyecto

```
clothing-store-shop/
├── app/
│   ├── layout.tsx          # Layout principal con providers
│   ├── page.tsx            # Página de inicio (catálogo)
│   ├── product/[id]/       # Página de detalle de producto
│   ├── cart/               # Carrito de compras
│   ├── checkout/           # Proceso de pago
│   ├── auth/               # Login y registro
│   └── orders/             # Historial de pedidos
├── components/
│   ├── Navbar.tsx          # Barra de navegación
│   ├── Footer.tsx          # Pie de página
│   └── ProductCard.tsx     # Tarjeta de producto
├── hooks/
│   ├── useAuth.tsx         # Hook de autenticación
│   └── useCart.tsx         # Hook del carrito
└── lib/
    └── supabase.ts         # Cliente de Supabase
```

## Características

✅ Catálogo de productos con búsqueda y filtros
✅ Autenticación de clientes
✅ Carrito de compras con localStorage
✅ Sistema de pedidos online
✅ Seguimiento de pedidos
✅ Responsive design

## Próximos Pasos

1. Personalizar el diseño y colores
2. Añadir página de detalle de producto
3. Implementar proceso de checkout
4. Añadir página de seguimiento de pedidos
5. Configurar pasarela de pago (opcional)

## Notas Importantes

- Este proyecto NO afecta tu sistema POS existente
- Comparte la misma base de datos de Supabase
- Los clientes y empleados están completamente separados mediante RLS
- Puedes desplegar este proyecto de forma independiente

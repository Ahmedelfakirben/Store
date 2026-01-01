'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'fr' | 'es';

interface Translations {
    // Navigation
    home: string;
    shop: string;
    categories: string;
    cart: string;
    login: string;
    signup: string;
    logout: string;
    myOrders: string;
    myProfile: string;

    // Hero Section
    heroTitle: string;
    heroSubtitle: string;
    shopNow: string;

    // Search & Filters
    searchPlaceholder: string;
    allCategories: string;
    sortBy: string;
    sortNewest: string;
    sortPriceLowHigh: string;
    sortPriceHighLow: string;
    sortNameAZ: string;

    // Product Card
    new: string;
    addToCart: string;
    outOfStock: string;

    // Product List
    noProductsFound: string;
    loading: string;

    // Auth Pages
    welcomeBack: string;
    loginSubtitle: string;
    email: string;
    password: string;
    loginButton: string;
    loggingIn: string;
    noAccount: string;
    createAccount: string;

    createAccountTitle: string;
    signupSubtitle: string;
    fullName: string;
    confirmPassword: string;
    signupButton: string;
    signingUp: string;
    haveAccount: string;
    loginHere: string;

    // Product Detail
    selectSize: string;
    quantity: string;
    productDetails: string;
    available: string;
    unavailable: string;

    // Cart
    shoppingCart: string;
    emptyCart: string;
    continueShopping: string;
    remove: string;
    subtotal: string;
    proceedToCheckout: string;

    // Checkout
    checkout: string;
    shippingAddress: string;
    fullAddress: string;
    city: string;
    postalCode: string;
    phone: string;
    paymentMethod: string;
    cashOnDelivery: string;
    orderSummary: string;
    total: string;
    placeOrder: string;
    placingOrder: string;

    // Orders
    myOrdersTitle: string;
    orderNumber: string;
    date: string;
    status: string;
    totalAmount: string;
    viewDetails: string;
    noOrders: string;

    // Order Status
    pending: string;
    confirmed: string;
    shipped: string;
    delivered: string;
    cancelled: string;

    // Profile
    myProfileTitle: string;
    personalInfo: string;
    save: string;
    saving: string;

    // Footer
    aboutUs: string;
    contactUs: string;
    termsOfService: string;
    privacyPolicy: string;
    followUs: string;
    allRightsReserved: string;
}

const translations: Record<Language, Translations> = {
    fr: {
        // Navigation
        home: 'Accueil',
        shop: 'Boutique',
        categories: 'Catégories',
        cart: 'Panier',
        login: 'Connexion',
        signup: 'Inscription',
        logout: 'Déconnexion',
        myOrders: 'Mes Commandes',
        myProfile: 'Mon Profil',

        // Hero Section
        heroTitle: 'Découvrez Notre Nouvelle Collection',
        heroSubtitle: 'Des styles tendance pour chaque occasion',
        shopNow: 'Acheter Maintenant',

        // Search & Filters
        searchPlaceholder: 'Rechercher des produits...',
        allCategories: 'Toutes les Catégories',
        sortBy: 'Trier par',
        sortNewest: 'Plus Récents',
        sortPriceLowHigh: 'Prix: Croissant',
        sortPriceHighLow: 'Prix: Décroissant',
        sortNameAZ: 'Nom: A-Z',

        // Product Card
        new: 'NOUVEAU',
        addToCart: 'Ajouter au Panier',
        outOfStock: 'Rupture de Stock',

        // Product List
        noProductsFound: 'Aucun produit trouvé',
        loading: 'Chargement...',

        // Auth Pages
        welcomeBack: 'Bon Retour!',
        loginSubtitle: 'Connectez-vous à votre compte',
        email: 'Email',
        password: 'Mot de passe',
        loginButton: 'Se Connecter',
        loggingIn: 'Connexion...',
        noAccount: 'Pas de compte?',
        createAccount: 'Créer un compte',

        createAccountTitle: 'Créer un Compte',
        signupSubtitle: 'Rejoignez-nous aujourd\'hui',
        fullName: 'Nom Complet',
        confirmPassword: 'Confirmer le Mot de Passe',
        signupButton: 'S\'inscrire',
        signingUp: 'Inscription...',
        haveAccount: 'Vous avez déjà un compte?',
        loginHere: 'Connectez-vous ici',

        // Product Detail
        selectSize: 'Sélectionner la Taille',
        quantity: 'Quantité',
        productDetails: 'Détails du Produit',
        available: 'Disponible',
        unavailable: 'Indisponible',

        // Cart
        shoppingCart: 'Panier d\'Achat',
        emptyCart: 'Votre panier est vide',
        continueShopping: 'Continuer vos Achats',
        remove: 'Retirer',
        subtotal: 'Sous-total',
        proceedToCheckout: 'Passer la Commande',

        // Checkout
        checkout: 'Finaliser la Commande',
        shippingAddress: 'Adresse de Livraison',
        fullAddress: 'Adresse Complète',
        city: 'Ville',
        postalCode: 'Code Postal',
        phone: 'Téléphone',
        paymentMethod: 'Mode de Paiement',
        cashOnDelivery: 'Paiement à la Livraison',
        orderSummary: 'Résumé de la Commande',
        total: 'Total',
        placeOrder: 'Passer la Commande',
        placingOrder: 'Commande en cours...',

        // Orders
        myOrdersTitle: 'Mes Commandes',
        orderNumber: 'Commande N°',
        date: 'Date',
        status: 'Statut',
        totalAmount: 'Montant Total',
        viewDetails: 'Voir Détails',
        noOrders: 'Vous n\'avez pas encore de commandes',

        // Order Status
        pending: 'En Attente',
        confirmed: 'Confirmée',
        shipped: 'Expédiée',
        delivered: 'Livrée',
        cancelled: 'Annulée',

        // Profile
        myProfileTitle: 'Mon Profil',
        personalInfo: 'Informations Personnelles',
        save: 'Enregistrer',
        saving: 'Enregistrement...',

        // Footer
        aboutUs: 'À Propos',
        contactUs: 'Nous Contacter',
        termsOfService: 'Conditions d\'Utilisation',
        privacyPolicy: 'Politique de Confidentialité',
        followUs: 'Suivez-nous',
        allRightsReserved: 'Tous droits réservés',
    },
    es: {
        // Navigation
        home: 'Inicio',
        shop: 'Tienda',
        categories: 'Categorías',
        cart: 'Carrito',
        login: 'Iniciar Sesión',
        signup: 'Registrarse',
        logout: 'Cerrar Sesión',
        myOrders: 'Mis Pedidos',
        myProfile: 'Mi Perfil',

        // Hero Section
        heroTitle: 'Descubre Nuestra Nueva Colección',
        heroSubtitle: 'Estilos de moda para cada ocasión',
        shopNow: 'Comprar Ahora',

        // Search & Filters
        searchPlaceholder: 'Buscar productos...',
        allCategories: 'Todas las Categorías',
        sortBy: 'Ordenar por',
        sortNewest: 'Más Recientes',
        sortPriceLowHigh: 'Precio: Menor a Mayor',
        sortPriceHighLow: 'Precio: Mayor a Menor',
        sortNameAZ: 'Nombre: A-Z',

        // Product Card
        new: 'NUEVO',
        addToCart: 'Añadir al Carrito',
        outOfStock: 'Agotado',

        // Product List
        noProductsFound: 'No se encontraron productos',
        loading: 'Cargando...',

        // Auth Pages
        welcomeBack: '¡Bienvenido de Nuevo!',
        loginSubtitle: 'Inicia sesión en tu cuenta',
        email: 'Correo Electrónico',
        password: 'Contraseña',
        loginButton: 'Iniciar Sesión',
        loggingIn: 'Iniciando sesión...',
        noAccount: '¿No tienes cuenta?',
        createAccount: 'Crear una cuenta',

        createAccountTitle: 'Crear una Cuenta',
        signupSubtitle: 'Únete a nosotros hoy',
        fullName: 'Nombre Completo',
        confirmPassword: 'Confirmar Contraseña',
        signupButton: 'Registrarse',
        signingUp: 'Registrando...',
        haveAccount: '¿Ya tienes cuenta?',
        loginHere: 'Inicia sesión aquí',

        // Product Detail
        selectSize: 'Seleccionar Talla',
        quantity: 'Cantidad',
        productDetails: 'Detalles del Producto',
        available: 'Disponible',
        unavailable: 'No Disponible',

        // Cart
        shoppingCart: 'Carrito de Compras',
        emptyCart: 'Tu carrito está vacío',
        continueShopping: 'Continuar Comprando',
        remove: 'Eliminar',
        subtotal: 'Subtotal',
        proceedToCheckout: 'Proceder al Pago',

        // Checkout
        checkout: 'Finalizar Compra',
        shippingAddress: 'Dirección de Envío',
        fullAddress: 'Dirección Completa',
        city: 'Ciudad',
        postalCode: 'Código Postal',
        phone: 'Teléfono',
        paymentMethod: 'Método de Pago',
        cashOnDelivery: 'Pago Contra Entrega',
        orderSummary: 'Resumen del Pedido',
        total: 'Total',
        placeOrder: 'Realizar Pedido',
        placingOrder: 'Procesando pedido...',

        // Orders
        myOrdersTitle: 'Mis Pedidos',
        orderNumber: 'Pedido N°',
        date: 'Fecha',
        status: 'Estado',
        totalAmount: 'Monto Total',
        viewDetails: 'Ver Detalles',
        noOrders: 'Aún no tienes pedidos',

        // Order Status
        pending: 'Pendiente',
        confirmed: 'Confirmado',
        shipped: 'Enviado',
        delivered: 'Entregado',
        cancelled: 'Cancelado',

        // Profile
        myProfileTitle: 'Mi Perfil',
        personalInfo: 'Información Personal',
        save: 'Guardar',
        saving: 'Guardando...',

        // Footer
        aboutUs: 'Sobre Nosotros',
        contactUs: 'Contáctanos',
        termsOfService: 'Términos de Servicio',
        privacyPolicy: 'Política de Privacidad',
        followUs: 'Síguenos',
        allRightsReserved: 'Todos los derechos reservados',
    },
};

interface LanguageContextType {
    language: Language;
    setLanguage: (lang: Language) => void;
    t: Translations;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
    const [language, setLanguageState] = useState<Language>('fr');

    useEffect(() => {
        const saved = localStorage.getItem('shop-language') as Language;
        if (saved && (saved === 'fr' || saved === 'es')) {
            setLanguageState(saved);
        }
    }, []);

    const setLanguage = (lang: Language) => {
        setLanguageState(lang);
        localStorage.setItem('shop-language', lang);
    };

    return (
        <LanguageContext.Provider value={{ language, setLanguage, t: translations[language] }}>
            {children}
        </LanguageContext.Provider>
    );
}

export function useLanguage() {
    const context = useContext(LanguageContext);
    if (!context) {
        throw new Error('useLanguage must be used within LanguageProvider');
    }
    return context;
}

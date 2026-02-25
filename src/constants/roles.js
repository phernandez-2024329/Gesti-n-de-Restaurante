// central list of role identifiers used by the API

export const Roles = {
    ADMIN: 'ADMIN',
    GERENTE: 'GERENTE',
    MESERO: 'MESERO',
    CLIENTE: 'CLIENTE',

    // nuevos roles solicitados
    ROL_CLIENTE: 'ROL_CLIENTE',
    ROL_TYPE_CLIENTE: 'ROL_TYPE_CLIENTE',
    ROL_ADMINISTRADOR_PLATAFORMA: 'ROL_ADMINISTRADOR_PLATAFORMA',
    ROL_ADMINISTRADOR_RESTAURANTES: 'ROL_ADMINISTRADOR_RESTAURANTES',
};

export const AllowedRoles = Object.values(Roles);

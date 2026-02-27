namespace AuthServiceRestaurante.Domain.Constants;

public static class RoleConstants
{
    public const string ADMIN_ROLE = "ADMIN_ROLE";
    public const string USER_ROLE = "USER_ROLE";

    // nuevos roles solicitados
    public const string ROL_CLIENTE = "ROL_CLIENTE";
    public const string ROL_TYPE_CLIENTE = "ROL_TYPE_CLIENTE";
    public const string ROL_ADMINISTRADOR_PLATAFORMA = "ROL_ADMINISTRADOR_PLATAFORMA";
    public const string ROL_ADMINISTRADOR_RESTAURANTES = "ROL_ADMINISTRADOR_RESTAURANTES";

    public static readonly string[] AllowedRoles = new[]
    {
        ADMIN_ROLE,
        USER_ROLE,
        ROL_CLIENTE,
        ROL_TYPE_CLIENTE,
        ROL_ADMINISTRADOR_PLATAFORMA,
        ROL_ADMINISTRADOR_RESTAURANTES
    };
}
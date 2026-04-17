'use strict';

import swaggerUi from 'swagger-ui-express';

const BASE_PATH = '/GestorRestaurante/v1';

const TAGS = [
  {
    name: 'Mesa',
    description: 'Gestion de mesas (endpoint real: /table)',
  },
  {
    name: 'Menu',
    description: 'Gestion de menu del restaurante',
  },
];

const AUTH_SECURITY = [{ bearerAuth: [] }, { xTokenAuth: [] }];

const MONGO_ID_SCHEMA = {
  type: 'string',
  pattern: '^[0-9a-fA-F]{24}$',
  example: '67f6f2cf2a1e6b17f34ef001',
};

const COMMON_RESPONSES = {
  BadRequest: {
    description: 'Solicitud invalida',
    content: {
      'application/json': {
        schema: { $ref: '#/components/schemas/ErrorResponse' },
        example: {
          success: false,
          message: 'No se proporcionaron datos para actualizar',
          error: 'VALIDATION_ERROR',
        },
      },
    },
  },
  Unauthorized: {
    description: 'Token faltante, expirado o invalido',
    content: {
      'application/json': {
        schema: { $ref: '#/components/schemas/AuthErrorResponse' },
        example: {
          success: false,
          message: 'No se proporciono un token de acceso',
          error: 'MISSING_TOKEN',
        },
      },
    },
  },
  Forbidden: {
    description: 'El rol no tiene permiso para esta operacion',
    content: {
      'application/json': {
        schema: { $ref: '#/components/schemas/ErrorResponse' },
        example: {
          success: false,
          message: 'No tiene permisos para realizar esta accion',
          error: 'FORBIDDEN',
        },
      },
    },
  },
  InvalidId: {
    description: 'ID invalido',
    content: {
      'application/json': {
        schema: { $ref: '#/components/schemas/InvalidIdResponse' },
        example: {
          success: false,
          message: 'ID no valido',
          error: 'INVALID_ID',
        },
      },
    },
  },
  InternalServerError: {
    description: 'Error interno',
    content: {
      'application/json': {
        schema: { $ref: '#/components/schemas/ErrorResponse' },
        example: {
          success: false,
          message: 'Error interno del servidor',
          error: 'INTERNAL_SERVER_ERROR',
        },
      },
    },
  },
};

const TABLE_PATHS = {
  [`${BASE_PATH}/table`]: {
    post: {
      tags: ['Mesa'],
      operationId: 'createTable',
      summary: 'Crear mesa',
      description:
        'Crea una mesa nueva para un restaurante existente. Requiere autenticacion y rol ADMIN o GERENTE.',
      security: AUTH_SECURITY,
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/TableCreateInput' },
            examples: {
              ejemplo: {
                value: {
                  table_name: 'Mesa Terraza 1',
                  table_number: 12,
                  table_ubication: 'Terraza norte',
                  table_capacity: 4,
                  table_time_available: '12:00-22:00',
                  table_state: 'Disponible',
                  restaurant_id: '67f6f2cf2a1e6b17f34ef001',
                  reserva_id: '67f6f2cf2a1e6b17f34ef002',
                },
              },
            },
          },
        },
      },
      responses: {
        201: {
          description: 'Mesa creada',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/TableMutationResponse' },
            },
          },
        },
        400: { $ref: '#/components/responses/BadRequest' },
        401: { $ref: '#/components/responses/Unauthorized' },
        403: { $ref: '#/components/responses/Forbidden' },
        404: {
          description: 'Restaurante no encontrado',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ErrorResponse' },
            },
          },
        },
        500: { $ref: '#/components/responses/InternalServerError' },
      },
    },
    get: {
      tags: ['Mesa'],
      operationId: 'listTables',
      summary: 'Listar mesas',
      description: 'Lista mesas activas. Permite filtrar por restaurant_id.',
      security: AUTH_SECURITY,
      parameters: [
        {
          in: 'query',
          name: 'restaurant_id',
          required: false,
          description: 'ID del restaurante para filtrar mesas por restaurante.',
          schema: { $ref: '#/components/schemas/MongoId' },
        },
      ],
      responses: {
        200: {
          description: 'Mesas obtenidas',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/TableListResponse' },
            },
          },
        },
        401: { $ref: '#/components/responses/Unauthorized' },
        500: { $ref: '#/components/responses/InternalServerError' },
      },
    },
  },

  [`${BASE_PATH}/table/{id}`]: {
    get: {
      tags: ['Mesa'],
      operationId: 'getTableById',
      summary: 'Obtener mesa por ID',
      description: 'Obtiene una mesa activa por su ID.',
      security: AUTH_SECURITY,
      parameters: [{ $ref: '#/components/parameters/IdPathParam' }],
      responses: {
        200: {
          description: 'Mesa encontrada',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/TableGetResponse' },
            },
          },
        },
        400: { $ref: '#/components/responses/InvalidId' },
        401: { $ref: '#/components/responses/Unauthorized' },
        404: {
          description: 'Mesa no encontrada',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ErrorResponse' },
            },
          },
        },
        500: { $ref: '#/components/responses/InternalServerError' },
      },
    },
    put: {
      tags: ['Mesa'],
      operationId: 'updateTableById',
      summary: 'Actualizar mesa por ID',
      description:
        'Actualiza uno o varios campos de una mesa. Requiere autenticacion y rol ADMIN o GERENTE.',
      security: AUTH_SECURITY,
      parameters: [{ $ref: '#/components/parameters/IdPathParam' }],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/TableUpdateInput' },
          },
        },
      },
      responses: {
        200: {
          description: 'Mesa actualizada',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/TableMutationResponse' },
            },
          },
        },
        400: { $ref: '#/components/responses/InvalidId' },
        401: { $ref: '#/components/responses/Unauthorized' },
        403: { $ref: '#/components/responses/Forbidden' },
        404: {
          description: 'Mesa no encontrada',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ErrorResponse' },
            },
          },
        },
        500: { $ref: '#/components/responses/InternalServerError' },
      },
    },
    delete: {
      tags: ['Mesa'],
      operationId: 'deleteTableById',
      summary: 'Eliminar mesa (borrado logico)',
      description: 'Marca la mesa como inactiva (estado=false). Requiere rol ADMIN.',
      security: AUTH_SECURITY,
      parameters: [{ $ref: '#/components/parameters/IdPathParam' }],
      responses: {
        200: {
          description: 'Mesa eliminada',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/TableMutationResponse' },
            },
          },
        },
        400: { $ref: '#/components/responses/InvalidId' },
        401: { $ref: '#/components/responses/Unauthorized' },
        403: { $ref: '#/components/responses/Forbidden' },
        404: {
          description: 'Mesa no encontrada',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ErrorResponse' },
            },
          },
        },
        500: { $ref: '#/components/responses/InternalServerError' },
      },
    },
  },
};

const MENU_PATHS = {
  [`${BASE_PATH}/menu`]: {
    post: {
      tags: ['Menu'],
      operationId: 'createMenu',
      summary: 'Crear menu',
      description: 'Crea un elemento de menu con plato, bebida, precio y categorias.',
      security: AUTH_SECURITY,
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/MenuCreateInput' },
            examples: {
              ejemplo: {
                value: {
                  Menu_id: 1001,
                  Menu_Plate: 'Pasta Alfredo',
                  Menu_Price: 9.99,
                  Menu_Drink: 'Limonada',
                  Menu_type_plate: 'Plato_fuerte',
                  Menu_type_drink: 'Bebidas_sin_alcohol',
                  Menu_Promotion: 'Promocion_de_Temporada',
                  Menu_description_plate: 'Pasta cremosa con parmesano',
                  Menu_ingredients: ['Pasta', 'Crema', 'Queso parmesano'],
                  Menu_available: true,
                  Restaurant_id: '67f6f2cf2a1e6b17f34ef001',
                },
              },
            },
          },
        },
      },
      responses: {
        201: {
          description: 'Menu creado',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/MenuMutationResponse' },
            },
          },
        },
        400: { $ref: '#/components/responses/BadRequest' },
        401: { $ref: '#/components/responses/Unauthorized' },
        500: { $ref: '#/components/responses/InternalServerError' },
      },
    },
    get: {
      tags: ['Menu'],
      operationId: 'listMenus',
      summary: 'Listar menus',
      description: 'Obtiene todos los menus registrados.',
      security: AUTH_SECURITY,
      responses: {
        200: {
          description: 'Menus obtenidos',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/MenuListResponse' },
            },
          },
        },
        401: { $ref: '#/components/responses/Unauthorized' },
        500: { $ref: '#/components/responses/InternalServerError' },
      },
    },
  },

  [`${BASE_PATH}/menu/search`]: {
    get: {
      tags: ['Menu'],
      operationId: 'searchMenu',
      summary: 'Buscar menu',
      description:
        'Busca por precio exacto (si searchTerm es numerico) o por coincidencia exacta en plato, bebida y tipos.',
      security: AUTH_SECURITY,
      parameters: [
        {
          in: 'query',
          name: 'searchTerm',
          required: true,
          description: 'Termino de busqueda. Puede ser numero (precio) o texto exacto.',
          schema: { type: 'string', example: 'Pasta Alfredo' },
        },
      ],
      responses: {
        200: {
          description: 'Menus encontrados',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/MenuSearchResponse' },
            },
          },
        },
        400: {
          description: 'searchTerm faltante',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ErrorResponse' },
            },
          },
        },
        401: { $ref: '#/components/responses/Unauthorized' },
        404: {
          description: 'Sin resultados',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ErrorResponse' },
            },
          },
        },
        500: { $ref: '#/components/responses/InternalServerError' },
      },
    },
  },

  [`${BASE_PATH}/menu/{id}`]: {
    get: {
      tags: ['Menu'],
      operationId: 'getMenuById',
      summary: 'Obtener menu por ID',
      description: 'Obtiene un menu por su ID.',
      security: AUTH_SECURITY,
      parameters: [{ $ref: '#/components/parameters/IdPathParam' }],
      responses: {
        200: {
          description: 'Menu encontrado',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/MenuGetResponse' },
            },
          },
        },
        400: { $ref: '#/components/responses/InvalidId' },
        401: { $ref: '#/components/responses/Unauthorized' },
        404: {
          description: 'Menu no encontrado',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ErrorResponse' },
            },
          },
        },
        500: { $ref: '#/components/responses/InternalServerError' },
      },
    },
    put: {
      tags: ['Menu'],
      operationId: 'updateMenuById',
      summary: 'Actualizar menu por ID',
      description: 'Actualiza uno o varios campos del menu.',
      security: AUTH_SECURITY,
      parameters: [{ $ref: '#/components/parameters/IdPathParam' }],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/MenuUpdateInput' },
          },
        },
      },
      responses: {
        200: {
          description: 'Menu actualizado',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/MenuMutationResponse' },
            },
          },
        },
        400: { $ref: '#/components/responses/InvalidId' },
        401: { $ref: '#/components/responses/Unauthorized' },
        404: {
          description: 'Menu no encontrado',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ErrorResponse' },
            },
          },
        },
        500: { $ref: '#/components/responses/InternalServerError' },
      },
    },
    delete: {
      tags: ['Menu'],
      operationId: 'deleteMenuById',
      summary: 'Eliminar menu por ID',
      description: 'Elimina de forma permanente un menu por su ID.',
      security: AUTH_SECURITY,
      parameters: [{ $ref: '#/components/parameters/IdPathParam' }],
      responses: {
        200: {
          description: 'Menu eliminado',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/MenuMutationResponse' },
            },
          },
        },
        400: { $ref: '#/components/responses/InvalidId' },
        401: { $ref: '#/components/responses/Unauthorized' },
        404: {
          description: 'Menu no encontrado',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ErrorResponse' },
            },
          },
        },
        500: { $ref: '#/components/responses/InternalServerError' },
      },
    },
  },
};

const COMPONENTS = {
  securitySchemes: {
    bearerAuth: {
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
      description: 'Authorization: Bearer <token>',
    },
    xTokenAuth: {
      type: 'apiKey',
      in: 'header',
      name: 'x-token',
      description: 'Alternativa de autenticacion con x-token',
    },
  },
  parameters: {
    IdPathParam: {
      in: 'path',
      name: 'id',
      required: true,
      schema: { $ref: '#/components/schemas/MongoId' },
    },
  },
  responses: COMMON_RESPONSES,
  schemas: {
    MongoId: MONGO_ID_SCHEMA,
    ErrorResponse: {
      type: 'object',
      properties: {
        success: { type: 'boolean', nullable: true, example: false },
        message: { type: 'string', example: 'Error al procesar la solicitud' },
        error: {
          oneOf: [{ type: 'string' }, { type: 'object' }],
          nullable: true,
          example: 'VALIDATION_ERROR',
        },
      },
    },
    AuthErrorResponse: {
      allOf: [
        { $ref: '#/components/schemas/ErrorResponse' },
        {
          type: 'object',
          properties: {
            error: {
              type: 'string',
              enum: ['MISSING_TOKEN', 'TOKEN_EXPIRED', 'INVALID_TOKEN'],
            },
          },
        },
      ],
    },
    InvalidIdResponse: {
      allOf: [
        { $ref: '#/components/schemas/ErrorResponse' },
        {
          type: 'object',
          properties: { error: { type: 'string', example: 'INVALID_ID' } },
        },
      ],
    },

    Table: {
      type: 'object',
      properties: {
        _id: { $ref: '#/components/schemas/MongoId' },
        table_name: { type: 'string' },
        table_number: { type: 'integer', minimum: 1 },
        table_ubication: { type: 'string' },
        table_capacity: { type: 'integer', minimum: 1 },
        table_time_available: { type: 'string', nullable: true, example: '12:00-22:00' },
        table_state: { type: 'string', enum: ['Disponible', 'Ocupada', 'Reservada'] },
        restaurant_id: {
          oneOf: [
            { $ref: '#/components/schemas/MongoId' },
            {
              type: 'object',
              properties: {
                _id: { $ref: '#/components/schemas/MongoId' },
                restaurant_name: { type: 'string' },
                restaurant_direction: { type: 'string' },
              },
            },
          ],
        },
        reserva_id: {
          oneOf: [{ $ref: '#/components/schemas/MongoId' }, { type: 'object' }, { type: 'null' }],
          nullable: true,
        },
        estado: { type: 'boolean', default: true },
        disponibilidad: { type: 'string', example: 'Libre' },
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' },
      },
    },
    TableCreateInput: {
      type: 'object',
      required: ['table_name', 'table_number', 'table_ubication', 'table_capacity', 'restaurant_id'],
      properties: {
        table_name: { type: 'string', minLength: 1 },
        table_number: { type: 'integer', minimum: 1 },
        table_ubication: { type: 'string', minLength: 1 },
        table_capacity: { type: 'integer', minimum: 1 },
        table_time_available: { type: 'string' },
        table_state: { type: 'string', enum: ['Disponible', 'Ocupada', 'Reservada'] },
        restaurant_id: { $ref: '#/components/schemas/MongoId' },
        reserva_id: { $ref: '#/components/schemas/MongoId' },
      },
    },
    TableUpdateInput: {
      type: 'object',
      minProperties: 1,
      properties: {
        table_name: { type: 'string' },
        table_number: { type: 'integer', minimum: 1 },
        table_ubication: { type: 'string' },
        table_capacity: { type: 'integer', minimum: 1 },
        table_time_available: { type: 'string' },
        table_state: { type: 'string', enum: ['Disponible', 'Ocupada', 'Reservada'] },
        restaurant_id: { $ref: '#/components/schemas/MongoId' },
        reserva_id: {
          oneOf: [{ $ref: '#/components/schemas/MongoId' }, { type: 'null' }],
        },
      },
      example: {
        table_state: 'Reservada',
        table_capacity: 6,
      },
    },
    TableMutationResponse: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        message: { type: 'string', example: 'Mesa creada' },
        table: { $ref: '#/components/schemas/Table' },
      },
      example: {
        success: true,
        message: 'Mesa creada',
        table: {
          _id: '67f6f2cf2a1e6b17f34ef111',
          table_name: 'Mesa Terraza 1',
          table_number: 12,
          table_ubication: 'Terraza norte',
          table_capacity: 4,
          table_time_available: '12:00-22:00',
          table_state: 'Disponible',
          restaurant_id: '67f6f2cf2a1e6b17f34ef001',
          reserva_id: null,
          estado: true,
          disponibilidad: 'Libre',
        },
      },
    },
    TableGetResponse: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        table: { $ref: '#/components/schemas/Table' },
      },
      example: {
        success: true,
        table: {
          _id: '67f6f2cf2a1e6b17f34ef111',
          table_name: 'Mesa Terraza 1',
          table_number: 12,
          table_ubication: 'Terraza norte',
          table_capacity: 4,
          table_time_available: '12:00-22:00',
          table_state: 'Disponible',
          restaurant_id: '67f6f2cf2a1e6b17f34ef001',
          reserva_id: null,
          estado: true,
          disponibilidad: 'Libre',
        },
      },
    },
    TableListResponse: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        total: { type: 'integer', example: 2 },
        tables: {
          type: 'array',
          items: { $ref: '#/components/schemas/Table' },
        },
      },
      example: {
        success: true,
        total: 1,
        tables: [
          {
            _id: '67f6f2cf2a1e6b17f34ef111',
            table_name: 'Mesa Terraza 1',
            table_number: 12,
            table_ubication: 'Terraza norte',
            table_capacity: 4,
            table_state: 'Disponible',
            restaurant_id: {
              _id: '67f6f2cf2a1e6b17f34ef001',
              restaurant_name: 'Restaurante Demo',
              restaurant_direction: 'Zona 10',
            },
            disponibilidad: 'Libre',
          },
        ],
      },
    },

    Menu: {
      type: 'object',
      properties: {
        _id: { $ref: '#/components/schemas/MongoId' },
        Menu_id: { type: 'integer', example: 1001 },
        Menu_Plate: { type: 'string' },
        Menu_Price: { type: 'number', minimum: 0 },
        Menu_Drink: { type: 'string' },
        Menu_type_plate: { type: 'string', enum: ['Entrada', 'Plato_fuerte', 'Postre', 'Bebida'] },
        Menu_type_drink: {
          type: 'string',
          enum: ['Cerveza', 'Vinos', 'Licores', 'Cocteles', 'shots', 'Bebidas_sin_alcohol', 'Bebidas_calientes'],
        },
        Menu_Promotion: {
          type: 'string',
          nullable: true,
          enum: [
            'Promocion_Familiar',
            'Promocion_de_Quincena',
            'Promocion_de_Cliente_frecuente',
            'Promocion_de_Temporada',
            'Promocion_de_Aniversario',
          ],
        },
        Menu_description_plate: { type: 'string' },
        Menu_ingredients: { type: 'array', items: { type: 'string' } },
        Menu_available: { type: 'boolean', default: true },
        Restaurant_id: { $ref: '#/components/schemas/MongoId' },
      },
    },
    MenuCreateInput: {
      type: 'object',
      required: [
        'Menu_id',
        'Menu_Plate',
        'Menu_Price',
        'Menu_Drink',
        'Menu_type_plate',
        'Menu_type_drink',
        'Menu_description_plate',
        'Restaurant_id',
      ],
      properties: {
        Menu_id: { type: 'integer' },
        Menu_Plate: { type: 'string' },
        Menu_Price: { type: 'number', minimum: 0 },
        Menu_Drink: { type: 'string' },
        Menu_type_plate: { type: 'string', enum: ['Entrada', 'Plato_fuerte', 'Postre', 'Bebida'] },
        Menu_type_drink: {
          type: 'string',
          enum: ['Cerveza', 'Vinos', 'Licores', 'Cocteles', 'shots', 'Bebidas_sin_alcohol', 'Bebidas_calientes'],
        },
        Menu_Promotion: {
          type: 'string',
          enum: [
            'Promocion_Familiar',
            'Promocion_de_Quincena',
            'Promocion_de_Cliente_frecuente',
            'Promocion_de_Temporada',
            'Promocion_de_Aniversario',
          ],
        },
        Menu_description_plate: { type: 'string' },
        Menu_ingredients: { type: 'array', items: { type: 'string' } },
        Menu_available: { type: 'boolean' },
        Restaurant_id: { $ref: '#/components/schemas/MongoId' },
      },
    },
    MenuUpdateInput: {
      type: 'object',
      minProperties: 1,
      properties: {
        Menu_id: { type: 'integer' },
        Menu_Plate: { type: 'string' },
        Menu_Price: { type: 'number', minimum: 0 },
        Menu_Drink: { type: 'string' },
        Menu_type_plate: { type: 'string', enum: ['Entrada', 'Plato_fuerte', 'Postre', 'Bebida'] },
        Menu_type_drink: {
          type: 'string',
          enum: ['Cerveza', 'Vinos', 'Licores', 'Cocteles', 'shots', 'Bebidas_sin_alcohol', 'Bebidas_calientes'],
        },
        Menu_Promotion: {
          oneOf: [
            {
              type: 'string',
              enum: [
                'Promocion_Familiar',
                'Promocion_de_Quincena',
                'Promocion_de_Cliente_frecuente',
                'Promocion_de_Temporada',
                'Promocion_de_Aniversario',
              ],
            },
            { type: 'null' },
          ],
        },
        Menu_description_plate: { type: 'string' },
        Menu_ingredients: { type: 'array', items: { type: 'string' } },
        Menu_available: { type: 'boolean' },
        Restaurant_id: { $ref: '#/components/schemas/MongoId' },
      },
      example: {
        Menu_Price: 10.5,
        Menu_available: false,
      },
    },
    MenuMutationResponse: {
      type: 'object',
      properties: {
        success: { type: 'boolean', nullable: true, example: true },
        message: { type: 'string', example: 'Menu creado exitosamente' },
        data: { $ref: '#/components/schemas/Menu' },
      },
      example: {
        success: true,
        message: 'Menu creado exitosamente',
        data: {
          _id: '67f6f2cf2a1e6b17f34ef201',
          Menu_id: 1001,
          Menu_Plate: 'Pasta Alfredo',
          Menu_Price: 9.99,
          Menu_Drink: 'Limonada',
          Menu_type_plate: 'Plato_fuerte',
          Menu_type_drink: 'Bebidas_sin_alcohol',
          Menu_Promotion: 'Promocion_de_Temporada',
          Menu_description_plate: 'Pasta cremosa con parmesano',
          Menu_ingredients: ['Pasta', 'Crema', 'Queso parmesano'],
          Menu_available: true,
          Restaurant_id: '67f6f2cf2a1e6b17f34ef001',
        },
      },
    },
    MenuGetResponse: {
      type: 'object',
      properties: {
        success: { type: 'boolean', nullable: true, example: true },
        message: { type: 'string', example: 'Menu obtenido exitosamente' },
        data: { $ref: '#/components/schemas/Menu' },
      },
      example: {
        success: true,
        message: 'Menu obtenido exitosamente',
        data: {
          _id: '67f6f2cf2a1e6b17f34ef201',
          Menu_id: 1001,
          Menu_Plate: 'Pasta Alfredo',
          Menu_Price: 9.99,
          Menu_Drink: 'Limonada',
          Menu_type_plate: 'Plato_fuerte',
          Menu_type_drink: 'Bebidas_sin_alcohol',
          Menu_description_plate: 'Pasta cremosa con parmesano',
          Menu_ingredients: ['Pasta', 'Crema', 'Queso parmesano'],
          Menu_available: true,
          Restaurant_id: '67f6f2cf2a1e6b17f34ef001',
        },
      },
    },
    MenuListResponse: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Menus obtenidos exitosamente' },
        data: { type: 'array', items: { $ref: '#/components/schemas/Menu' } },
      },
      example: {
        message: 'Menus obtenidos exitosamente',
        data: [
          {
            _id: '67f6f2cf2a1e6b17f34ef201',
            Menu_id: 1001,
            Menu_Plate: 'Pasta Alfredo',
            Menu_Price: 9.99,
            Menu_Drink: 'Limonada',
            Menu_type_plate: 'Plato_fuerte',
            Menu_type_drink: 'Bebidas_sin_alcohol',
            Menu_available: true,
            Restaurant_id: '67f6f2cf2a1e6b17f34ef001',
          },
        ],
      },
    },
    MenuSearchResponse: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Menus encontrados exitosamente' },
        count: { type: 'integer', example: 1 },
        data: { type: 'array', items: { $ref: '#/components/schemas/Menu' } },
      },
      example: {
        message: 'Menus encontrados exitosamente',
        count: 1,
        data: [
          {
            _id: '67f6f2cf2a1e6b17f34ef201',
            Menu_id: 1001,
            Menu_Plate: 'Pasta Alfredo',
            Menu_Price: 9.99,
            Menu_Drink: 'Limonada',
            Menu_type_plate: 'Plato_fuerte',
            Menu_type_drink: 'Bebidas_sin_alcohol',
            Menu_available: true,
            Restaurant_id: '67f6f2cf2a1e6b17f34ef001',
          },
        ],
      },
    },
  },
};

const swaggerSpec = {
  openapi: '3.0.3',
  info: {
    title: 'GestorRestaurante API - Mesa y Menu',
    description:
      'Documentacion de Mesa y Menu. Incluye todos los endpoints reales montados para estos modulos.',
    version: '1.0.0',
  },
  servers: [{ url: 'http://localhost:3000', description: 'Local' }],
  tags: TAGS,
  paths: {
    ...TABLE_PATHS,
    ...MENU_PATHS,
  },
  components: COMPONENTS,
};

export const registerSwagger = (app, basePath = BASE_PATH) => {
  app.use(
    `${basePath}/docs`,
    swaggerUi.serve,
    swaggerUi.setup(swaggerSpec, {
      customSiteTitle: 'GestorRestaurante API Docs',
      explorer: true,
    })
  );

  app.get(`${basePath}/docs-json`, (req, res) => {
    res.status(200).json(swaggerSpec);
  });
};

export default swaggerSpec;

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
  {
    name: 'Pedidos',
    description: 'Pedidos / ordenes (endpoint real: /order)',
  },
  {
    name: 'DetallePedido',
    description: 'Lineas de detalle de pedido (endpoint real: /detalle-pedido)',
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

const ORDER_PATHS = {
  [`${BASE_PATH}/order`]: {
    post: {
      tags: ['Pedidos'],
      operationId: 'createOrder',
      summary: 'Crear pedido',
      description:
        'Crea un pedido. Requiere JWT. Si no envia User_id, el backend puede usar el usuario del token.',
      security: AUTH_SECURITY,
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/OrderCreateInput' },
            examples: {
              ejemplo: {
                value: {
                  Orders_domicile: 'Zona 10, Ciudad',
                  Orders_number: 'ORD-1001',
                  Orders_facture: 'FAC-001',
                  Orders_facture_descripcion: 'Pasta + bebida',
                  Orders_cupon: 'Envio_Gratis',
                  Restaurant_id: '67f6f2cf2a1e6b17f34ef001',
                  Menu_id: '67f6f2cf2a1e6b17f34ef201',
                  User_id: '67f6f2cf2a1e6b17f34ef301',
                },
              },
            },
          },
        },
      },
      responses: {
        201: {
          description: 'Pedido creado',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/OrderMutationResponse' },
            },
          },
        },
        400: { $ref: '#/components/responses/BadRequest' },
        401: { $ref: '#/components/responses/Unauthorized' },
        500: { $ref: '#/components/responses/InternalServerError' },
      },
    },
    get: {
      tags: ['Pedidos'],
      operationId: 'listOrders',
      summary: 'Listar pedidos activos',
      description: 'Lista pedidos con estado=true.',
      security: AUTH_SECURITY,
      responses: {
        200: {
          description: 'Lista de pedidos',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/OrderListResponse' },
            },
          },
        },
        401: { $ref: '#/components/responses/Unauthorized' },
        500: { $ref: '#/components/responses/InternalServerError' },
      },
    },
  },

  [`${BASE_PATH}/order/search`]: {
    get: {
      tags: ['Pedidos'],
      operationId: 'searchOrders',
      summary: 'Buscar pedidos',
      description:
        'Busca por numero de orden (numerico), domicilio, cupon o factura. Requiere query searchTerm.',
      security: AUTH_SECURITY,
      parameters: [
        {
          in: 'query',
          name: 'searchTerm',
          required: true,
          schema: { type: 'string', example: 'ORD-1001' },
        },
      ],
      responses: {
        200: {
          description: 'Resultados',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/OrderSearchResponse' },
            },
          },
        },
        400: { $ref: '#/components/responses/BadRequest' },
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

  [`${BASE_PATH}/order/{id}`]: {
    get: {
      tags: ['Pedidos'],
      operationId: 'getOrderById',
      summary: 'Obtener pedido por ID',
      security: AUTH_SECURITY,
      parameters: [{ $ref: '#/components/parameters/IdPathParam' }],
      responses: {
        200: {
          description: 'Pedido encontrado',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/OrderGetResponse' },
            },
          },
        },
        400: { $ref: '#/components/responses/InvalidId' },
        401: { $ref: '#/components/responses/Unauthorized' },
        404: {
          description: 'No encontrado',
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
      tags: ['Pedidos'],
      operationId: 'updateOrderById',
      summary: 'Actualizar pedido',
      description: 'Actualiza uno o mas campos del pedido.',
      security: AUTH_SECURITY,
      parameters: [{ $ref: '#/components/parameters/IdPathParam' }],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/OrderUpdateInput' },
          },
        },
      },
      responses: {
        200: {
          description: 'Actualizado',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/OrderMutationResponse' },
            },
          },
        },
        400: { $ref: '#/components/responses/BadRequest' },
        401: { $ref: '#/components/responses/Unauthorized' },
        404: {
          description: 'No encontrado',
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
      tags: ['Pedidos'],
      operationId: 'deleteOrderById',
      summary: 'Eliminar pedido (logico)',
      description: 'Marca estado=false.',
      security: AUTH_SECURITY,
      parameters: [{ $ref: '#/components/parameters/IdPathParam' }],
      responses: {
        200: {
          description: 'Eliminado',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/OrderMutationResponse' },
            },
          },
        },
        400: { $ref: '#/components/responses/InvalidId' },
        401: { $ref: '#/components/responses/Unauthorized' },
        404: {
          description: 'No encontrado',
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

const DETALLE_PEDIDO_PATHS = {
  [`${BASE_PATH}/detalle-pedido`]: {
    post: {
      tags: ['DetallePedido'],
      operationId: 'createDetallePedido',
      summary: 'Crear detalle de pedido',
      description:
        'Registra una linea de detalle (producto, cantidad, precio). total = candidadproducto * preciounitario.',
      security: AUTH_SECURITY,
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/DetallePedidoCreateInput' },
            examples: {
              ejemplo: {
                value: {
                  pedido: '67f6f2cf2a1e6b17f34ef401',
                  producto: '67f6f2cf2a1e6b17f34ef501',
                  candidadproducto: 2,
                  preciounitario: 25.5,
                },
              },
            },
          },
        },
      },
      responses: {
        201: {
          description: 'Creado',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/DetallePedidoMutationResponse' },
            },
          },
        },
        400: { $ref: '#/components/responses/BadRequest' },
        401: { $ref: '#/components/responses/Unauthorized' },
        500: { $ref: '#/components/responses/InternalServerError' },
      },
    },
    get: {
      tags: ['DetallePedido'],
      operationId: 'listDetallePedido',
      summary: 'Listar detalles activos',
      security: AUTH_SECURITY,
      responses: {
        200: {
          description: 'Lista',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/DetallePedidoListResponse' },
            },
          },
        },
        401: { $ref: '#/components/responses/Unauthorized' },
        500: { $ref: '#/components/responses/InternalServerError' },
      },
    },
  },

  [`${BASE_PATH}/detalle-pedido/{id}`]: {
    get: {
      tags: ['DetallePedido'],
      operationId: 'getDetallePedidoById',
      summary: 'Obtener detalle por ID',
      security: AUTH_SECURITY,
      parameters: [{ $ref: '#/components/parameters/IdPathParam' }],
      responses: {
        200: {
          description: 'Encontrado',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/DetallePedidoGetResponse' },
            },
          },
        },
        400: { $ref: '#/components/responses/InvalidId' },
        401: { $ref: '#/components/responses/Unauthorized' },
        404: {
          description: 'No encontrado',
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
      tags: ['DetallePedido'],
      operationId: 'updateDetallePedidoById',
      summary: 'Actualizar detalle',
      security: AUTH_SECURITY,
      parameters: [{ $ref: '#/components/parameters/IdPathParam' }],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/DetallePedidoUpdateInput' },
          },
        },
      },
      responses: {
        200: {
          description: 'Actualizado',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/DetallePedidoMutationResponse' },
            },
          },
        },
        400: { $ref: '#/components/responses/BadRequest' },
        401: { $ref: '#/components/responses/Unauthorized' },
        404: {
          description: 'No encontrado',
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
      tags: ['DetallePedido'],
      operationId: 'deleteDetallePedidoById',
      summary: 'Eliminar detalle (logico)',
      security: AUTH_SECURITY,
      parameters: [{ $ref: '#/components/parameters/IdPathParam' }],
      responses: {
        200: {
          description: 'Eliminado',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/DetallePedidoDeleteResponse' },
            },
          },
        },
        400: { $ref: '#/components/responses/InvalidId' },
        401: { $ref: '#/components/responses/Unauthorized' },
        404: {
          description: 'No encontrado',
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

    Order: {
      type: 'object',
      properties: {
        _id: { $ref: '#/components/schemas/MongoId' },
        Orders_id: { type: 'string', example: 'ORD-1700000000000-a1b2c3d4' },
        Orders_domicile: { type: 'string' },
        Orders_number: { type: 'string' },
        Orders_cupon: {
          type: 'string',
          nullable: true,
          enum: [
            'Cupon_30_Quetzales',
            'Cupon_20%_Descuento',
            'Dos_Por_Uno',
            'Envio_Gratis',
            'Primera_Compra',
            'Descuento_10%',
            'Cupon_50_Quetzales',
            'Cupon_15%_Descuento',
            null,
          ],
        },
        Orders_facture: { type: 'string' },
        Orders_facture_descripcion: { type: 'string' },
        Orders_status: {
          type: 'string',
          enum: ['en_preparacion', 'listo', 'entregado', 'cancelado'],
        },
        Restaurant_id: { $ref: '#/components/schemas/MongoId' },
        Menu_id: { $ref: '#/components/schemas/MongoId' },
        User_id: { $ref: '#/components/schemas/MongoId' },
        estado: { type: 'boolean' },
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' },
      },
    },
    OrderCreateInput: {
      type: 'object',
      required: [
        'Orders_domicile',
        'Orders_number',
        'Orders_facture',
        'Orders_facture_descripcion',
        'Restaurant_id',
        'Menu_id',
      ],
      properties: {
        Orders_domicile: { type: 'string' },
        Orders_number: { type: 'string' },
        Orders_facture: { type: 'string' },
        Orders_facture_descripcion: { type: 'string' },
        Orders_cupon: {
          type: 'string',
          enum: [
            'Cupon_30_Quetzales',
            'Cupon_20%_Descuento',
            'Dos_Por_Uno',
            'Envio_Gratis',
            'Primera_Compra',
            'Descuento_10%',
            'Cupon_50_Quetzales',
            'Cupon_15%_Descuento',
          ],
        },
        Orders_id: { type: 'string', description: 'Opcional; el servidor puede generar uno' },
        Restaurant_id: { $ref: '#/components/schemas/MongoId' },
        Menu_id: { $ref: '#/components/schemas/MongoId' },
        User_id: { $ref: '#/components/schemas/MongoId', description: 'Opcional; puede tomarse del JWT' },
      },
    },
    OrderUpdateInput: {
      type: 'object',
      minProperties: 1,
      properties: {
        Orders_domicile: { type: 'string' },
        Orders_number: { type: 'string' },
        Orders_facture: { type: 'string' },
        Orders_facture_descripcion: { type: 'string' },
        Orders_cupon: { type: 'string', nullable: true },
        Orders_status: {
          type: 'string',
          enum: ['en_preparacion', 'listo', 'entregado', 'cancelado'],
        },
        Restaurant_id: { $ref: '#/components/schemas/MongoId' },
        Menu_id: { $ref: '#/components/schemas/MongoId' },
        User_id: { $ref: '#/components/schemas/MongoId' },
      },
    },
    OrderMutationResponse: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Orden creada exitosamente' },
        data: { $ref: '#/components/schemas/Order' },
      },
    },
    OrderGetResponse: {
      type: 'object',
      properties: {
        message: { type: 'string' },
        data: { $ref: '#/components/schemas/Order' },
      },
    },
    OrderListResponse: {
      type: 'object',
      properties: {
        message: { type: 'string' },
        data: { type: 'array', items: { $ref: '#/components/schemas/Order' } },
      },
    },
    OrderSearchResponse: {
      type: 'object',
      properties: {
        message: { type: 'string' },
        count: { type: 'integer' },
        data: { type: 'array', items: { $ref: '#/components/schemas/Order' } },
      },
    },

    DetallePedido: {
      type: 'object',
      properties: {
        _id: { $ref: '#/components/schemas/MongoId' },
        pedido: { type: 'string', description: 'Referencia al pedido' },
        producto: { type: 'string' },
        candidadproducto: { type: 'integer', minimum: 1 },
        preciounitario: { type: 'number', minimum: 0 },
        total: { type: 'number' },
        estado: { type: 'boolean' },
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' },
      },
    },
    DetallePedidoCreateInput: {
      type: 'object',
      required: ['pedido', 'producto', 'candidadproducto', 'preciounitario'],
      properties: {
        pedido: { type: 'string' },
        producto: { type: 'string' },
        candidadproducto: { type: 'integer', minimum: 1 },
        preciounitario: { type: 'number', minimum: 0 },
      },
    },
    DetallePedidoUpdateInput: {
      type: 'object',
      minProperties: 1,
      properties: {
        pedido: { type: 'string' },
        producto: { type: 'string' },
        candidadproducto: { type: 'integer', minimum: 1 },
        preciounitario: { type: 'number', minimum: 0 },
      },
    },
    DetallePedidoMutationResponse: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        message: { type: 'string' },
        detallePedido: { $ref: '#/components/schemas/DetallePedido' },
      },
    },
    DetallePedidoGetResponse: {
      type: 'object',
      properties: {
        success: { type: 'boolean' },
        detallePedido: { $ref: '#/components/schemas/DetallePedido' },
      },
    },
    DetallePedidoListResponse: {
      type: 'object',
      properties: {
        success: { type: 'boolean' },
        detallePedidos: { type: 'array', items: { $ref: '#/components/schemas/DetallePedido' } },
      },
    },
    DetallePedidoDeleteResponse: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        message: { type: 'string', example: 'Detalle de pedido eliminado correctamente' },
      },
    },
  },
};

const swaggerSpec = {
  openapi: '3.0.3',
  info: {
    title: 'GestorRestaurante API - Mesa, Menu, Pedidos y DetallePedido',
    description:
      'Documentacion OpenAPI: Mesa, Menu, Pedidos (/order) y Detalle de pedido (/detalle-pedido).',
    version: '1.0.0',
  },
  servers: [{ url: 'http://localhost:3000', description: 'Local' }],
  tags: TAGS,
  paths: {
    ...TABLE_PATHS,
    ...MENU_PATHS,
    ...ORDER_PATHS,
    ...DETALLE_PEDIDO_PATHS,
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

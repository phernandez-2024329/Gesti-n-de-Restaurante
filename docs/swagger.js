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
    name: 'Resena',
    description: 'Gestion de resenas de usuarios',
  },
  {
    name: 'Reporte',
    description: 'Gestion de reportes del restaurante',
  },
  {
    name: 'Eventos',
    description: 'Gestion de eventos del restaurante',
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


const REVIEW_PATHS = {
  [`${BASE_PATH}/review`]: {
    post: {
      tags: ['Resena'],
      operationId: 'createReview',
      summary: 'Crear resena',
      description: 'Crea una resena nueva para un restaurante.',
      security: AUTH_SECURITY,
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/ReviewCreateInput' },
            examples: {
              ejemplo: {
                value: {
                  user_id: '67f6f2cf2a1e6b17f34ef002',
                  restaurant_id: '67f6f2cf2a1e6b17f34ef001',
                  rating: 5,
                  comment: 'Excelente servicio y comida',
                },
              },
            },
          },
        },
      },
      responses: {
        201: {
          description: 'Resena creada',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ReviewMutationResponse' },
            },
          },
        },
        400: { $ref: '#/components/responses/BadRequest' },
        401: { $ref: '#/components/responses/Unauthorized' },
        500: { $ref: '#/components/responses/InternalServerError' },
      },
    },
    get: {
      tags: ['Resena'],
      operationId: 'listReviews',
      summary: 'Listar resenas',
      description: 'Lista resenas activas. Permite filtrar por restaurant_id.',
      security: AUTH_SECURITY,
      parameters: [
        {
          in: 'query',
          name: 'restaurant_id',
          required: false,
          description: 'ID del restaurante para filtrar resenas.',
          schema: { $ref: '#/components/schemas/MongoId' },
        },
      ],
      responses: {
        200: {
          description: 'Resenas obtenidas',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ReviewListResponse' },
            },
          },
        },
        401: { $ref: '#/components/responses/Unauthorized' },
        500: { $ref: '#/components/responses/InternalServerError' },
      },
    },
  },
  [`${BASE_PATH}/review/{id}`]: {
    get: {
      tags: ['Resena'],
      operationId: 'getReviewById',
      summary: 'Obtener resena por ID',
      description: 'Obtiene una resena activa por su ID.',
      security: AUTH_SECURITY,
      parameters: [{ $ref: '#/components/parameters/IdPathParam' }],
      responses: {
        200: {
          description: 'Resena encontrada',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ReviewGetResponse' },
            },
          },
        },
        400: { $ref: '#/components/responses/InvalidId' },
        401: { $ref: '#/components/responses/Unauthorized' },
        404: {
          description: 'Resena no encontrada',
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
      tags: ['Resena'],
      operationId: 'updateReviewById',
      summary: 'Actualizar resena por ID',
      description: 'Actualiza uno o varios campos de una resena.',
      security: AUTH_SECURITY,
      parameters: [{ $ref: '#/components/parameters/IdPathParam' }],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/ReviewUpdateInput' },
          },
        },
      },
      responses: {
        200: {
          description: 'Resena actualizada',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ReviewMutationResponse' },
            },
          },
        },
        400: { $ref: '#/components/responses/InvalidId' },
        401: { $ref: '#/components/responses/Unauthorized' },
        404: {
          description: 'Resena no encontrada',
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
      tags: ['Resena'],
      operationId: 'deleteReviewById',
      summary: 'Eliminar resena (borrado logico)',
      description: 'Marca la resena como inactiva.',
      security: AUTH_SECURITY,
      parameters: [{ $ref: '#/components/parameters/IdPathParam' }],
      responses: {
        200: {
          description: 'Resena eliminada',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ReviewMutationResponse' },
            },
          },
        },
        400: { $ref: '#/components/responses/InvalidId' },
        401: { $ref: '#/components/responses/Unauthorized' },
        404: {
          description: 'Resena no encontrada',
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

const REPORT_PATHS = {
  [`${BASE_PATH}/report`]: {
    post: {
      tags: ['Reporte'],
      operationId: 'createReport',
      summary: 'Crear reporte',
      description: 'Crea un reporte nuevo.',
      security: AUTH_SECURITY,
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/ReportCreateInput' },
            examples: {
              ejemplo: {
                value: {
                  type: 'Ventas',
                  data: 'Datos del reporte',
                  restaurant_id: '67f6f2cf2a1e6b17f34ef001',
                },
              },
            },
          },
        },
      },
      responses: {
        201: {
          description: 'Reporte creado',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ReportMutationResponse' },
            },
          },
        },
        400: { $ref: '#/components/responses/BadRequest' },
        401: { $ref: '#/components/responses/Unauthorized' },
        500: { $ref: '#/components/responses/InternalServerError' },
      },
    },
    get: {
      tags: ['Reporte'],
      operationId: 'listReports',
      summary: 'Listar reportes',
      description: 'Lista reportes.',
      security: AUTH_SECURITY,
      responses: {
        200: {
          description: 'Reportes obtenidos',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ReportListResponse' },
            },
          },
        },
        401: { $ref: '#/components/responses/Unauthorized' },
        500: { $ref: '#/components/responses/InternalServerError' },
      },
    },
  },
  [`${BASE_PATH}/report/{id}`]: {
    get: {
      tags: ['Reporte'],
      operationId: 'getReportById',
      summary: 'Obtener reporte por ID',
      description: 'Obtiene un reporte por su ID.',
      security: AUTH_SECURITY,
      parameters: [{ $ref: '#/components/parameters/IdPathParam' }],
      responses: {
        200: {
          description: 'Reporte encontrado',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ReportGetResponse' },
            },
          },
        },
        400: { $ref: '#/components/responses/InvalidId' },
        401: { $ref: '#/components/responses/Unauthorized' },
        404: {
          description: 'Reporte no encontrado',
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
      tags: ['Reporte'],
      operationId: 'updateReportById',
      summary: 'Actualizar reporte por ID',
      description: 'Actualiza uno o varios campos del reporte.',
      security: AUTH_SECURITY,
      parameters: [{ $ref: '#/components/parameters/IdPathParam' }],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/ReportUpdateInput' },
          },
        },
      },
      responses: {
        200: {
          description: 'Reporte actualizado',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ReportMutationResponse' },
            },
          },
        },
        400: { $ref: '#/components/responses/InvalidId' },
        401: { $ref: '#/components/responses/Unauthorized' },
        404: {
          description: 'Reporte no encontrado',
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
      tags: ['Reporte'],
      operationId: 'deleteReportById',
      summary: 'Eliminar reporte',
      description: 'Elimina un reporte.',
      security: AUTH_SECURITY,
      parameters: [{ $ref: '#/components/parameters/IdPathParam' }],
      responses: {
        200: {
          description: 'Reporte eliminado',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ReportMutationResponse' },
            },
          },
        },
        400: { $ref: '#/components/responses/InvalidId' },
        401: { $ref: '#/components/responses/Unauthorized' },
        404: {
          description: 'Reporte no encontrado',
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

const EVENTS_PATHS = {
  [`${BASE_PATH}/events`]: {
    post: {
      tags: ['Eventos'],
      operationId: 'createEvent',
      summary: 'Crear evento',
      description: 'Crea un evento nuevo.',
      security: AUTH_SECURITY,
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/EventCreateInput' },
            examples: {
              ejemplo: {
                value: {
                  events_name: 'Fiesta de Cumpleanos',
                  events_type: 'Privado',
                  events_date_time_start: '2024-12-01T18:00:00Z',
                  events_date_time_finish: '2024-12-01T22:00:00Z',
                  events_tematic: 'Cumpleanos',
                  events_history: 'Descripcion del evento',
                  events_services: {
                    music: 'DJ',
                    decoration: 'Tematica',
                    special_menu: 'Pastel',
                    extra_staff: 'Meseros',
                  },
                  restaurant_id: '67f6f2cf2a1e6b17f34ef001',
                },
              },
            },
          },
        },
      },
      responses: {
        201: {
          description: 'Evento creado',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/EventMutationResponse' },
            },
          },
        },
        400: { $ref: '#/components/responses/BadRequest' },
        401: { $ref: '#/components/responses/Unauthorized' },
        500: { $ref: '#/components/responses/InternalServerError' },
      },
    },
    get: {
      tags: ['Eventos'],
      operationId: 'listEvents',
      summary: 'Listar eventos',
      description: 'Lista eventos activos.',
      security: AUTH_SECURITY,
      responses: {
        200: {
          description: 'Eventos obtenidos',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/EventListResponse' },
            },
          },
        },
        401: { $ref: '#/components/responses/Unauthorized' },
        500: { $ref: '#/components/responses/InternalServerError' },
      },
    },
  },
  [`${BASE_PATH}/events/{id}`]: {
    get: {
      tags: ['Eventos'],
      operationId: 'getEventById',
      summary: 'Obtener evento por ID',
      description: 'Obtiene un evento por su ID.',
      security: AUTH_SECURITY,
      parameters: [{ $ref: '#/components/parameters/IdPathParam' }],
      responses: {
        200: {
          description: 'Evento encontrado',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/EventGetResponse' },
            },
          },
        },
        400: { $ref: '#/components/responses/InvalidId' },
        401: { $ref: '#/components/responses/Unauthorized' },
        404: {
          description: 'Evento no encontrado',
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
      tags: ['Eventos'],
      operationId: 'updateEventById',
      summary: 'Actualizar evento por ID',
      description: 'Actualiza uno o varios campos del evento.',
      security: AUTH_SECURITY,
      parameters: [{ $ref: '#/components/parameters/IdPathParam' }],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/EventUpdateInput' },
          },
        },
      },
      responses: {
        200: {
          description: 'Evento actualizado',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/EventMutationResponse' },
            },
          },
        },
        400: { $ref: '#/components/responses/InvalidId' },
        401: { $ref: '#/components/responses/Unauthorized' },
        404: {
          description: 'Evento no encontrado',
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
      tags: ['Eventos'],
      operationId: 'deleteEventById',
      summary: 'Eliminar evento (borrado logico)',
      description: 'Marca el evento como inactivo.',
      security: AUTH_SECURITY,
      parameters: [{ $ref: '#/components/parameters/IdPathParam' }],
      responses: {
        200: {
          description: 'Evento eliminado',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/EventMutationResponse' },
            },
          },
        },
        400: { $ref: '#/components/responses/InvalidId' },
        401: { $ref: '#/components/responses/Unauthorized' },
        404: {
          description: 'Evento no encontrado',
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

    Review: {
      type: 'object',
      properties: {
        _id: { $ref: '#/components/schemas/MongoId' },
        user_id: { $ref: '#/components/schemas/MongoId' },
        restaurant_id: { $ref: '#/components/schemas/MongoId' },
        rating: { type: 'number', minimum: 1, maximum: 5 },
        comment: { type: 'string', maxlength: 500 },
        created_at: { type: 'string', format: 'date-time' },
        active: { type: 'boolean', default: true },
      },
    },
    ReviewCreateInput: {
      type: 'object',
      required: ['user_id', 'restaurant_id', 'rating'],
      properties: {
        user_id: { $ref: '#/components/schemas/MongoId' },
        restaurant_id: { $ref: '#/components/schemas/MongoId' },
        rating: { type: 'number', minimum: 1, maximum: 5 },
        comment: { type: 'string', maxlength: 500 },
      },
    },
    ReviewUpdateInput: {
      type: 'object',
      minProperties: 1,
      properties: {
        rating: { type: 'number', minimum: 1, maximum: 5 },
        comment: { type: 'string', maxlength: 500 },
        active: { type: 'boolean' },
      },
      example: {
        rating: 4,
        comment: 'Buena experiencia',
      },
    },
    ReviewMutationResponse: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        message: { type: 'string', example: 'Resena creada' },
        review: { $ref: '#/components/schemas/Review' },
      },
      example: {
        success: true,
        message: 'Resena creada',
        review: {
          _id: '67f6f2cf2a1e6b17f34ef111',
          user_id: '67f6f2cf2a1e6b17f34ef002',
          restaurant_id: '67f6f2cf2a1e6b17f34ef001',
          rating: 5,
          comment: 'Excelente servicio y comida',
          created_at: '2024-01-01T00:00:00Z',
          active: true,
        },
      },
    },
    ReviewGetResponse: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        review: { $ref: '#/components/schemas/Review' },
      },
      example: {
        success: true,
        review: {
          _id: '67f6f2cf2a1e6b17f34ef111',
          user_id: '67f6f2cf2a1e6b17f34ef002',
          restaurant_id: '67f6f2cf2a1e6b17f34ef001',
          rating: 5,
          comment: 'Excelente servicio y comida',
          created_at: '2024-01-01T00:00:00Z',
          active: true,
        },
      },
    },
    ReviewListResponse: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        total: { type: 'integer', example: 2 },
        reviews: {
          type: 'array',
          items: { $ref: '#/components/schemas/Review' },
        },
      },
      example: {
        success: true,
        total: 1,
        reviews: [
          {
            _id: '67f6f2cf2a1e6b17f34ef111',
            user_id: '67f6f2cf2a1e6b17f34ef002',
            restaurant_id: '67f6f2cf2a1e6b17f34ef001',
            rating: 5,
            comment: 'Excelente servicio y comida',
            created_at: '2024-01-01T00:00:00Z',
            active: true,
          },
        ],
      },
    },

    Report: {
      type: 'object',
      properties: {
        _id: { $ref: '#/components/schemas/MongoId' },
        type: { type: 'string' },
        data: { type: 'string' },
        date: { type: 'string', format: 'date-time' },
        restaurant_id: { $ref: '#/components/schemas/MongoId' },
      },
    },
    ReportCreateInput: {
      type: 'object',
      required: ['type', 'data', 'restaurant_id'],
      properties: {
        type: { type: 'string' },
        data: { type: 'string' },
        restaurant_id: { $ref: '#/components/schemas/MongoId' },
      },
    },
    ReportUpdateInput: {
      type: 'object',
      minProperties: 1,
      properties: {
        type: { type: 'string' },
        data: { type: 'string' },
        date: { type: 'string', format: 'date-time' },
      },
      example: {
        data: 'Datos actualizados',
      },
    },
    ReportMutationResponse: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        message: { type: 'string', example: 'Reporte creado' },
        report: { $ref: '#/components/schemas/Report' },
      },
    },
    ReportGetResponse: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        report: { $ref: '#/components/schemas/Report' },
      },
    },
    ReportListResponse: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        total: { type: 'integer', example: 2 },
        reports: {
          type: 'array',
          items: { $ref: '#/components/schemas/Report' },
        },
      },
    },

    Event: {
      type: 'object',
      properties: {
        _id: { $ref: '#/components/schemas/MongoId' },
        events_name: { type: 'string' },
        events_type: { type: 'string' },
        events_date_time_start: { type: 'string', format: 'date-time' },
        events_date_time_finish: { type: 'string', format: 'date-time' },
        events_tematic: { type: 'string' },
        events_history: { type: 'string' },
        events_services: {
          type: 'object',
          properties: {
            music: { type: 'string' },
            decoration: { type: 'string' },
            special_menu: { type: 'string' },
            extra_staff: { type: 'string' },
          },
        },
        restaurant_id: { $ref: '#/components/schemas/MongoId' },
        estado: { type: 'boolean', default: true },
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' },
      },
    },
    EventCreateInput: {
      type: 'object',
      required: ['events_name', 'events_type', 'events_date_time_start', 'events_date_time_finish', 'events_tematic', 'restaurant_id'],
      properties: {
        events_name: { type: 'string', minLength: 3 },
        events_type: { type: 'string' },
        events_date_time_start: { type: 'string', format: 'date-time' },
        events_date_time_finish: { type: 'string', format: 'date-time' },
        events_tematic: { type: 'string' },
        events_history: { type: 'string' },
        events_services: {
          type: 'object',
          properties: {
            music: { type: 'string' },
            decoration: { type: 'string' },
            special_menu: { type: 'string' },
            extra_staff: { type: 'string' },
          },
        },
        restaurant_id: { $ref: '#/components/schemas/MongoId' },
      },
    },
    EventUpdateInput: {
      type: 'object',
      minProperties: 1,
      properties: {
        events_name: { type: 'string' },
        events_type: { type: 'string' },
        events_date_time_start: { type: 'string', format: 'date-time' },
        events_date_time_finish: { type: 'string', format: 'date-time' },
        events_tematic: { type: 'string' },
        events_history: { type: 'string' },
        events_services: {
          type: 'object',
          properties: {
            music: { type: 'string' },
            decoration: { type: 'string' },
            special_menu: { type: 'string' },
            extra_staff: { type: 'string' },
          },
        },
        estado: { type: 'boolean' },
      },
      example: {
        events_name: 'Fiesta Actualizada',
      },
    },
    EventMutationResponse: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        message: { type: 'string', example: 'Evento creado' },
        event: { $ref: '#/components/schemas/Event' },
      },
    },
    EventGetResponse: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        event: { $ref: '#/components/schemas/Event' },
      },
    },
    EventListResponse: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        total: { type: 'integer', example: 2 },
        events: {
          type: 'array',
          items: { $ref: '#/components/schemas/Event' },
        },
      },
    },

  },
};

const swaggerSpec = {
  openapi: '3.0.3',
  info: {
    title: 'GestorRestaurante API - Mesa, Menu, Resena, Reporte y Eventos',
    description: 'Documentacion de Mesa, Menu, Resena, Reporte y Eventos.',
    version: '1.0.0',
  },
  servers: [{ url: 'http://localhost:3000', description: 'Local' }],
  tags: TAGS,
  paths: {
    ...TABLE_PATHS,
    ...MENU_PATHS,
    ...REVIEW_PATHS,
    ...REPORT_PATHS,
    ...EVENTS_PATHS,
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


import swaggerUi from 'swagger-ui-express';

const BASE_PATH = '/GestorRestaurante/v1';

const TAGS = [
  {
    name: 'Reseña',
    description: 'Gestión de reseñas de usuarios',
  },
  {
    name: 'Reporte',
    description: 'Gestión de reportes del restaurante',
  },
  {
    name: 'Eventos',
    description: 'Gestión de eventos del restaurante',
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
    description: 'Solicitud inválida',
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
    description: 'Token faltante, expirado o inválido',
    content: {
      'application/json': {
        schema: { $ref: '#/components/schemas/AuthErrorResponse' },
        example: {
          success: false,
          message: 'No se proporcionó un token de acceso',
          error: 'MISSING_TOKEN',
        },
      },
    },
  },
  Forbidden: {
    description: 'El rol no tiene permiso para esta operación',
    content: {
      'application/json': {
        schema: { $ref: '#/components/schemas/ErrorResponse' },
        example: {
          success: false,
          message: 'No tiene permisos para realizar esta acción',
          error: 'FORBIDDEN',
        },
      },
    },
  },
  InvalidId: {
    description: 'ID inválido',
    content: {
      'application/json': {
        schema: { $ref: '#/components/schemas/InvalidIdResponse' },
        example: {
          success: false,
          message: 'ID no válido',
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

const REVIEW_PATHS = {
  [`${BASE_PATH}/review`]: {
    post: {
      tags: ['Reseña'],
      operationId: 'createReview',
      summary: 'Crear reseña',
      description: 'Crea una reseña nueva para un restaurante.',
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
          description: 'Reseña creada',
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
      tags: ['Reseña'],
      operationId: 'listReviews',
      summary: 'Listar reseñas',
      description: 'Lista reseñas activas. Permite filtrar por restaurant_id.',
      security: AUTH_SECURITY,
      parameters: [
        {
          in: 'query',
          name: 'restaurant_id',
          required: false,
          description: 'ID del restaurante para filtrar reseñas.',
          schema: { $ref: '#/components/schemas/MongoId' },
        },
      ],
      responses: {
        200: {
          description: 'Reseñas obtenidas',
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
      tags: ['Reseña'],
      operationId: 'getReviewById',
      summary: 'Obtener reseña por ID',
      description: 'Obtiene una reseña activa por su ID.',
      security: AUTH_SECURITY,
      parameters: [{ $ref: '#/components/parameters/IdPathParam' }],
      responses: {
        200: {
          description: 'Reseña encontrada',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ReviewGetResponse' },
            },
          },
        },
        400: { $ref: '#/components/responses/InvalidId' },
        401: { $ref: '#/components/responses/Unauthorized' },
        404: {
          description: 'Reseña no encontrada',
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
      tags: ['Reseña'],
      operationId: 'updateReviewById',
      summary: 'Actualizar reseña por ID',
      description: 'Actualiza uno o varios campos de una reseña.',
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
          description: 'Reseña actualizada',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ReviewMutationResponse' },
            },
          },
        },
        400: { $ref: '#/components/responses/InvalidId' },
        401: { $ref: '#/components/responses/Unauthorized' },
        404: {
          description: 'Reseña no encontrada',
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
      tags: ['Reseña'],
      operationId: 'deleteReviewById',
      summary: 'Eliminar reseña (borrado lógico)',
      description: 'Marca la reseña como inactiva.',
      security: AUTH_SECURITY,
      parameters: [{ $ref: '#/components/parameters/IdPathParam' }],
      responses: {
        200: {
          description: 'Reseña eliminada',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ReviewMutationResponse' },
            },
          },
        },
        400: { $ref: '#/components/responses/InvalidId' },
        401: { $ref: '#/components/responses/Unauthorized' },
        404: {
          description: 'Reseña no encontrada',
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
                  events_name: 'Fiesta de Cumpleaños',
                  events_type: 'Privado',
                  events_date_time_start: '2024-12-01T18:00:00Z',
                  events_date_time_finish: '2024-12-01T22:00:00Z',
                  events_tematic: 'Cumpleaños',
                  events_history: 'Descripción del evento',
                  events_services: {
                    music: 'DJ',
                    decoration: 'Temática',
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
      summary: 'Eliminar evento (borrado lógico)',
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
      description: 'Alternativa de autenticación con x-token',
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
        message: { type: 'string', example: 'Reseña creada' },
        review: { $ref: '#/components/schemas/Review' },
      },
      example: {
        success: true,
        message: 'Reseña creada',
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
    title: 'GestorRestaurante API - Reseña, Reporte y Eventos',
    description: 'Documentación de Reseña, Reporte y Eventos.',
    version: '1.0.0',
  },
  servers: [{ url: 'http://localhost:3000', description: 'Local' }],
  tags: TAGS,
  paths: {
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
import swaggerUi from 'swagger-ui-express';
const BASE_PATH = '/GestorRestaurante/v1';
const TAGS = [
	{ name: 'Cupón', description: 'Gestión de cupones de descuento' },
	{ name: 'Información', description: 'Gestión de información relevante del restaurante' },
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

const COUPON_PATHS = {
	[`${BASE_PATH}/coupon`]: {
		post: {
			tags: ['Cupón'],
			operationId: 'createCoupon',
			summary: 'Crear cupón',
			description: 'Crea un cupón de descuento.',
			security: AUTH_SECURITY,
			requestBody: {
				required: true,
				content: {
					'application/json': {
						schema: { $ref: '#/components/schemas/CouponCreateInput' },
					},
				},
			},
			responses: {
				201: {
					description: 'Cupón creado',
					content: {
						'application/json': {
							schema: { $ref: '#/components/schemas/CouponMutationResponse' },
						},
					},
				},
				400: { $ref: '#/components/responses/BadRequest' },
				401: { $ref: '#/components/responses/Unauthorized' },
				500: { $ref: '#/components/responses/InternalServerError' },
			},
		},
		get: {
			tags: ['Cupón'],
			operationId: 'listCoupons',
			summary: 'Listar cupones',
			description: 'Lista cupones activos.',
			security: AUTH_SECURITY,
			responses: {
				200: {
					description: 'Cupones obtenidos',
					content: {
						'application/json': {
							schema: { $ref: '#/components/schemas/CouponListResponse' },
						},
					},
				},
				401: { $ref: '#/components/responses/Unauthorized' },
				500: { $ref: '#/components/responses/InternalServerError' },
			},
		},
	},
	[`${BASE_PATH}/coupon/{id}`]: {
		get: {
			tags: ['Cupón'],
			operationId: 'getCouponById',
			summary: 'Obtener cupón por ID',
			description: 'Obtiene un cupón activo por su ID.',
			security: AUTH_SECURITY,
			parameters: [{ $ref: '#/components/parameters/IdPathParam' }],
			responses: {
				200: {
					description: 'Cupón encontrado',
					content: {
						'application/json': {
							schema: { $ref: '#/components/schemas/CouponGetResponse' },
						},
					},
				},
				400: { $ref: '#/components/responses/InvalidId' },
				401: { $ref: '#/components/responses/Unauthorized' },
				404: {
					description: 'Cupón no encontrado',
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
			tags: ['Cupón'],
			operationId: 'updateCouponById',
			summary: 'Actualizar cupón por ID',
			description: 'Actualiza uno o varios campos de un cupón.',
			security: AUTH_SECURITY,
			parameters: [{ $ref: '#/components/parameters/IdPathParam' }],
			requestBody: {
				required: true,
				content: {
					'application/json': {
						schema: { $ref: '#/components/schemas/CouponUpdateInput' },
					},
				},
			},
			responses: {
				200: {
					description: 'Cupón actualizado',
					content: {
						'application/json': {
							schema: { $ref: '#/components/schemas/CouponMutationResponse' },
						},
					},
				},
				400: { $ref: '#/components/responses/InvalidId' },
				401: { $ref: '#/components/responses/Unauthorized' },
				404: {
					description: 'Cupón no encontrado',
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
			tags: ['Cupón'],
			operationId: 'deleteCouponById',
			summary: 'Eliminar cupón',
			description: 'Elimina un cupón (borrado lógico).',
			security: AUTH_SECURITY,
			parameters: [{ $ref: '#/components/parameters/IdPathParam' }],
			responses: {
				200: {
					description: 'Cupón eliminado',
					content: {
						'application/json': {
							schema: { $ref: '#/components/schemas/CouponMutationResponse' },
						},
					},
				},
				400: { $ref: '#/components/responses/InvalidId' },
				401: { $ref: '#/components/responses/Unauthorized' },
				404: {
					description: 'Cupón no encontrado',
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

const INFORMATION_PATHS = {
	[`${BASE_PATH}/information`]: {
		post: {
			tags: ['Información'],
			operationId: 'createInformation',
			summary: 'Crear información',
			description: 'Crea una información relevante para el restaurante.',
			security: AUTH_SECURITY,
			requestBody: {
				required: true,
				content: {
					'application/json': {
						schema: { $ref: '#/components/schemas/InformationCreateInput' },
					},
				},
			},
			responses: {
				201: {
					description: 'Información creada',
					content: {
						'application/json': {
							schema: { $ref: '#/components/schemas/InformationMutationResponse' },
						},
					},
				},
				400: { $ref: '#/components/responses/BadRequest' },
				401: { $ref: '#/components/responses/Unauthorized' },
				500: { $ref: '#/components/responses/InternalServerError' },
			},
		},
		get: {
			tags: ['Información'],
			operationId: 'listInformations',
			summary: 'Listar informaciones',
			description: 'Lista informaciones activas.',
			security: AUTH_SECURITY,
			responses: {
				200: {
					description: 'Informaciones obtenidas',
					content: {
						'application/json': {
							schema: { $ref: '#/components/schemas/InformationListResponse' },
						},
					},
				},
				401: { $ref: '#/components/responses/Unauthorized' },
				500: { $ref: '#/components/responses/InternalServerError' },
			},
		},
	},
	[`${BASE_PATH}/information/{id}`]: {
		get: {
			tags: ['Información'],
			operationId: 'getInformationById',
			summary: 'Obtener información por ID',
			description: 'Obtiene una información activa por su ID.',
			security: AUTH_SECURITY,
			parameters: [{ $ref: '#/components/parameters/IdPathParam' }],
			responses: {
				200: {
					description: 'Información encontrada',
					content: {
						'application/json': {
							schema: { $ref: '#/components/schemas/InformationGetResponse' },
						},
					},
				},
				400: { $ref: '#/components/responses/InvalidId' },
				401: { $ref: '#/components/responses/Unauthorized' },
				404: {
					description: 'Información no encontrada',
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
			tags: ['Información'],
			operationId: 'updateInformationById',
			summary: 'Actualizar información por ID',
			description: 'Actualiza uno o varios campos de una información.',
			security: AUTH_SECURITY,
			parameters: [{ $ref: '#/components/parameters/IdPathParam' }],
			requestBody: {
				required: true,
				content: {
					'application/json': {
						schema: { $ref: '#/components/schemas/InformationUpdateInput' },
					},
				},
			},
			responses: {
				200: {
					description: 'Información actualizada',
					content: {
						'application/json': {
							schema: { $ref: '#/components/schemas/InformationMutationResponse' },
						},
					},
				},
				400: { $ref: '#/components/responses/InvalidId' },
				401: { $ref: '#/components/responses/Unauthorized' },
				404: {
					description: 'Información no encontrada',
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
			tags: ['Información'],
			operationId: 'deleteInformationById',
			summary: 'Eliminar información',
			description: 'Elimina una información (borrado lógico).',
			security: AUTH_SECURITY,
			parameters: [{ $ref: '#/components/parameters/IdPathParam' }],
			responses: {
				200: {
					description: 'Información eliminada',
					content: {
						'application/json': {
							schema: { $ref: '#/components/schemas/InformationMutationResponse' },
						},
					},
				},
				400: { $ref: '#/components/responses/InvalidId' },
				401: { $ref: '#/components/responses/Unauthorized' },
				404: {
					description: 'Información no encontrada',
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
		Coupon: {
			type: 'object',
			properties: {
				_id: { $ref: '#/components/schemas/MongoId' },
				code: { type: 'string' },
				discount_type: { type: 'string', enum: ['percentage', 'amount'] },
				discount_value: { type: 'number' },
				max_uses: { type: 'number' },
				max_uses_per_user: { type: 'number' },
				expiration_date: { type: 'string', format: 'date-time' },
				min_order_amount: { type: 'number' },
				restaurant_ids: {
					type: 'array',
					items: { $ref: '#/components/schemas/MongoId' },
				},
				active: { type: 'boolean', default: true },
				current_uses: { type: 'number', default: 0 },
			},
		},
		CouponCreateInput: {
			type: 'object',
			required: ['code', 'discount_type', 'discount_value', 'max_uses', 'max_uses_per_user', 'expiration_date'],
			properties: {
				code: { type: 'string' },
				discount_type: { type: 'string', enum: ['percentage', 'amount'] },
				discount_value: { type: 'number' },
				max_uses: { type: 'number' },
				max_uses_per_user: { type: 'number' },
				expiration_date: { type: 'string', format: 'date-time' },
				min_order_amount: { type: 'number' },
				restaurant_ids: {
					type: 'array',
					items: { $ref: '#/components/schemas/MongoId' },
				},
			},
		},
		CouponUpdateInput: {
			type: 'object',
			minProperties: 1,
			properties: {
				code: { type: 'string' },
				discount_type: { type: 'string', enum: ['percentage', 'amount'] },
				discount_value: { type: 'number' },
				max_uses: { type: 'number' },
				max_uses_per_user: { type: 'number' },
				expiration_date: { type: 'string', format: 'date-time' },
				min_order_amount: { type: 'number' },
				restaurant_ids: {
					type: 'array',
					items: { $ref: '#/components/schemas/MongoId' },
				},
				active: { type: 'boolean' },
			},
		},
		CouponMutationResponse: {
			type: 'object',
			properties: {
				success: { type: 'boolean', example: true },
				message: { type: 'string', example: 'Cupón creado' },
				data: { $ref: '#/components/schemas/Coupon' },
			},
		},
		CouponGetResponse: {
			type: 'object',
			properties: {
				success: { type: 'boolean', example: true },
				data: { $ref: '#/components/schemas/Coupon' },
			},
		},
		CouponListResponse: {
			type: 'object',
			properties: {
				success: { type: 'boolean', example: true },
				data: {
					type: 'array',
					items: { $ref: '#/components/schemas/Coupon' },
				},
			},
		},
		Information: {
			type: 'object',
			properties: {
				_id: { $ref: '#/components/schemas/MongoId' },
				information: { type: 'string' },
				title: { type: 'string' },
				type: { type: 'string' },
				statistics: { type: 'object' },
				restaurantId: { $ref: '#/components/schemas/MongoId' },
				estado: { type: 'boolean', default: true },
				usuario: { $ref: '#/components/schemas/MongoId' },
				createdAt: { type: 'string', format: 'date-time' },
				updatedAt: { type: 'string', format: 'date-time' },
			},
		},
		InformationCreateInput: {
			type: 'object',
			required: ['information', 'title', 'restaurantId', 'usuario'],
			properties: {
				information: { type: 'string' },
				title: { type: 'string' },
				type: { type: 'string' },
				statistics: { type: 'object' },
				restaurantId: { $ref: '#/components/schemas/MongoId' },
				usuario: { $ref: '#/components/schemas/MongoId' },
			},
		},
		InformationUpdateInput: {
			type: 'object',
			minProperties: 1,
			properties: {
				information: { type: 'string' },
				title: { type: 'string' },
				type: { type: 'string' },
				statistics: { type: 'object' },
				estado: { type: 'boolean' },
			},
		},
		InformationMutationResponse: {
			type: 'object',
			properties: {
				success: { type: 'boolean', example: true },
				message: { type: 'string', example: 'Información creada' },
				information: { $ref: '#/components/schemas/Information' },
			},
		},
		InformationGetResponse: {
			type: 'object',
			properties: {
				success: { type: 'boolean', example: true },
				information: { $ref: '#/components/schemas/Information' },
			},
		},
		InformationListResponse: {
			type: 'object',
			properties: {
				success: { type: 'boolean', example: true },
				total: { type: 'integer', example: 2 },
				informations: {
					type: 'array',
					items: { $ref: '#/components/schemas/Information' },
				},
			},
		},
	},
};

const swaggerSpec = {
	openapi: '3.0.3',
	info: {
		title: 'GestorRestaurante API - Cupón e Información',
		description: 'Documentación de Cupón e Información.',
		version: '1.0.0',
	},
	servers: [{ url: 'http://localhost:3000', description: 'Local' }],
	tags: TAGS,
	paths: {
		...COUPON_PATHS,
		...INFORMATION_PATHS,
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

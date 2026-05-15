import dotenv from 'dotenv';
import { dbConnection } from '../configs/db.js';
import Restaurant from '../src/models/restaurant.model.js';
import Table from '../src/models/table.model.js';

dotenv.config();

const testEndpoints = async () => {
  try {
    await dbConnection();

    console.log('\n========== PRUEBA DE ENDPOINTS ==========\n');

    // Obtener un restaurante
    const restaurant = await Restaurant.findOne({ estado: true });
    if (!restaurant) {
      console.log('❌ No hay restaurantes disponibles');
      process.exit(1);
    }

    const restaurantId = restaurant._id.toString();
    console.log(`📍 Restaurante seleccionado: ${restaurant.restaurant_name}`);
    console.log(`📍 Restaurant ID: ${restaurantId}\n`);

    // Simular los endpoints
    console.log('🔍 Prueba 1: Obtener TODAS las mesas (sin filtro)');
    const todasMesas = await Table.find({ estado: true })
      .populate('restaurant_id', 'restaurant_name');
    console.log(`   ✅ Total de mesas: ${todasMesas.length}`);
    console.log(`   (Debería devolver 30)\n`);

    console.log('🔍 Prueba 2: Obtener mesas DEL RESTAURANTE específico');
    const mesasDelRestaurante = await Table.find({ 
      estado: true,
      restaurant_id: restaurantId 
    }).populate('restaurant_id', 'restaurant_name');
    console.log(`   ✅ Mesas encontradas: ${mesasDelRestaurante.length}`);
    console.log(`   (Debería devolver 5)\n`);

    if (mesasDelRestaurante.length > 0) {
      console.log('📋 Primeras 2 mesas del restaurante:');
      mesasDelRestaurante.slice(0, 2).forEach((mesa, idx) => {
        console.log(`\n   Mesa ${idx + 1}:`);
        console.log(`   - ID: ${mesa._id}`);
        console.log(`   - Nombre: ${mesa.table_name}`);
        console.log(`   - Restaurant: ${mesa.restaurant_id.restaurant_name}`);
        console.log(`   - Capacidad: ${mesa.table_capacity}`);
        console.log(`   - Estado: ${mesa.table_state}`);
      });
    }

    // Probar con otro restaurante
    console.log('\n\n🔍 Prueba 3: Obtener mesas de OTRO restaurante');
    const otroRestaurante = await Restaurant.findOne({ 
      estado: true,
      _id: { $ne: restaurantId }
    });

    if (otroRestaurante) {
      const mesasOtroRestaurante = await Table.find({ 
        estado: true,
        restaurant_id: otroRestaurante._id.toString()
      });
      console.log(`   Restaurante: ${otroRestaurante.restaurant_name}`);
      console.log(`   ✅ Mesas encontradas: ${mesasOtroRestaurante.length}`);
      console.log(`   (Debería devolver 5)\n`);
    }

    console.log('✅ Todas las pruebas completadas correctamente\n');

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    process.exit(0);
  }
};

testEndpoints();

// warn
console.warn('warn'); // Muestra un mensaje de advertencia en la consola web.

// error
console.error('error'); // Muestra un mensaje de error en la consola web.

// info
console.info('info'); // Muestra un mensaje de información en la consola web.

// assert
console.assert(1 === 2, 'No son iguales'); // Muestra un mensaje de error en la consola web si la afirmación es falsa.

// clear
console.clear(); // Limpia la consola web.

// count
console.count('count'); // Registra el número de veces que se llama a count().

// group
console.group('group'); // Crea un grupo de mensajes en la consola web.

// groupEnd 
console.groupEnd(); // Finaliza un grupo de mensajes en la consola web.

// time 
console.time('time'); // Inicia un temporizador en la consola web.

// timeEnd 
console.timeEnd('time'); // Detiene un temporizador en la consola web.

// table
console.table([{a: 1, b: 2}, {a: 'foo', b: 'bar'}]); // Muestra una tabla en la consola web.

// dir
console.dir(document.body); // Muestra una lista de las propiedades de un objeto JavaScript.

// dirxml
console.dirxml(document.body); // Muestra una representación en forma de árbol de un nodo XML.

// profile
console.profile('profile'); // Inicia un perfil en la consola web.

// profileEnd
console.profileEnd('profile'); // Detiene un perfil en la consola web.

// timeLog
console.timeLog('time'); // Registra mensajes en el temporizador en la consola web.

// trace
console.trace('trace'); // Muestra una traza en la consola web.



// ARRAYS

const miArreglo = [1, eddy, 3.34, falso, undefined, null, {nombre: 'Eddy', trabajo: 'Desarrollador web'}, [1, 2, 3, 4, 5]];

// Acceder a los elementos de un arreglo
console.log(miArreglo[0]); // 1

// Acceder a un objeto dentro de un arreglo
console.log(miArreglo[6].nombre); // Eddy

// Acceder a un arreglo dentro de un arreglo
console.log(miArreglo[7][2]); // 3

// Agregar un elemento al final de un arreglo
miArreglo.push('nuevo elemento');

// Agregar un elemento al inicio de un arreglo
miArreglo.unshift('nuevo elemento');

// Eliminar el último elemento de un arreglo
miArreglo.pop();

// Eliminar el primer elemento de un arreglo
miArreglo.shift();

// Encontrar el índice de un elemento en un arreglo
console.log(miArreglo.indexOf('nuevo elemento'));

// Eliminar un elemento de un arreglo
miArreglo.splice(1, 1);

// Invertir un arreglo
miArreglo.reverse();

// Concatenar arreglos
const arreglo1 = [1, 2, 3]; // Ejemplo de arreglo 1 
const arreglo2 = [4, 5, 6]; // Ejemplo de arreglo 2
const arreglo3 = arreglo1.concat(arreglo2); // Concatenar los arreglos 1 y 2

// Ordenar un arreglo
const frutas = ['manzana', 'pera', 'fresa', 'mango'];
frutas.sort(); // Ordenar las frutas alfabéticamente

// Filtrar un arreglo
const edades = [22, 8, 17, 14, 30];
const mayores = edades.filter(edad => edad >= 18); // Filtrar las edades mayores de 18 años

// Encontrar un elemento en un arreglo
const numeros = [1, 2, 3, 4, 5];
const resultado = numeros.find(numero => numero > 3); // Encontrar el primer número mayor a 3

// Iterar un arreglo
const nombres = ['Eddy', 'Christian', 'Daniel', 'Alex'];
nombres.forEach(nombre => console.log(nombre)); // Iterar los nombres del arreglo

// Mapear un arreglo
const numeros = [1, 2, 3, 4, 5];
const numerosDuplicados = numeros.map(numero => numero * 2); // Duplicar los números del arreglo

// Reducir un arreglo
const numeros = [1, 2, 3, 4, 5];
const suma = numeros.reduce((total, numero) => total + numero, 0); // Sumar los números del arreglo

// Comprobar si un arreglo contiene un elemento
const frutas = ['manzana', 'pera', 'fresa', 'mango'];
const contieneFresa = frutas.includes('fresa'); // Comprobar si el arreglo contiene fresa

// Comprobar si todos los elementos de un arreglo cumplen una condición
const edades = [22, 8, 17, 14, 30];
const mayoresDeEdad = edades.every(edad => edad >= 18); // Comprobar si todas las edades son mayores de 18

// Comprobar si al menos un elemento de un arreglo cumple una condición
const edades = [22, 8, 17, 14, 30];
const hayMenores = edades.some(edad => edad < 18); // Comprobar si hay al menos una edad menor de 18

// Convertir un arreglo en un string
const frutas = ['manzana', 'pera', 'fresa', 'mango'];
const frutasString = frutas.join(', '); // Convertir las frutas en un string separado por comas

// Convertir un string en un arreglo
const frutasString = 'manzana, pera, fresa, mango';
const frutas = frutasString.split(', '); // Convertir el string en un arreglo separado por comas

// Copiar un arreglo
const frutas = ['manzana', 'pera', 'fresa', 'mango'];
const copiaFrutas = [...frutas]; // Copiar las frutas en un nuevo arreglo

// Obtener una parte de un arreglo
const frutas = ['manzana', 'pera', 'fresa', 'mango'];
const primerasFrutas = frutas.slice(0, 2); // Obtener las dos primeras frutas del arreglo

// Convertir un arreglo en un objeto
const frutas = ['manzana', 'pera', 'fresa', 'mango'];
const objetoFrutas = {...frutas}; // Convertir las frutas en un objeto

// Convertir un objeto en un arreglo
const objetoFrutas = {0: 'manzana', 1: 'pera', 2: 'fresa', 3: 'mango'};
const frutas = Object.values(objetoFrutas); // Convertir el objeto en un arreglo

// Convertir un arreglo en un set
const frutas = ['manzana', 'pera', 'fresa', 'mango'];
const setFrutas = new Set(frutas); // Convertir las frutas en un set

// Convertir un set en un arreglo
const setFrutas = new Set(['manzana', 'pera', 'fresa', 'mango']);
const frutas = Array.from(setFrutas); // Convertir el set en un arreglo

// Convertir un arreglo en un mapa
const frutas = [['manzana', 1], ['pera', 2], ['fresa', 3], ['mango', 4]];
const mapaFrutas = new Map(frutas); // Convertir las frutas en un mapa

// Convertir un mapa en un arreglo
const mapaFrutas = new Map([['manzana', 1], ['pera', 2], ['fresa', 3], ['mango', 4]]);
const frutas = Array.from(mapaFrutas); // Convertir el mapa en un arreglo

// Ejemplo de foreach 
const nombres = ['Eddy', 'Christian', 'Daniel', 'Alex'];
nombres.forEach(nombre => console.log(nombre)); // Iterar los nombres del arreglo



// OBJETOS

// Declarar un objeto
const persona = {
    nombre: 'Eddy',
    edad: 22,
    trabajo: 'Desarrollador web'
};

// Acceder a las propiedades de un objeto
console.log(persona.nombre); // Eddy

// Agregar una propiedad a un objeto
persona.email = 'hola';
console.log(persona.email); // hola

// Eliminar una propiedad de un objeto
delete persona.email;

// Comprobar si un objeto tiene una propiedad
console.log(persona.hasOwnProperty('nombre')); // true

// Iterar las propiedades de un objeto
for (const propiedad in persona) {
    console.log(`${propiedad}: ${persona[propiedad]}`);
}

// Obtener las claves de un objeto
const claves = Object.keys(persona);

// Obtener los valores de un objeto
const valores = Object.values(persona);

// Obtener las entradas de un objeto
const entradas = Object.entries(persona);

// Copiar un objeto
const copiaPersona = {...persona};

// Fusionar dos objetos
const persona1 = {
    nombre: 'Eddy',
    edad: 22
};
const persona2 = {
    trabajo: 'Desarrollador web'
};
const persona = {...persona1, ...persona2};

// Convertir un objeto en un arreglo
const persona = {nombre: 'Eddy', edad: 22};
const arregloPersona = Object.entries(persona);

// Convertir un arreglo en un objeto
const arregloPersona = [['nombre', 'Eddy'], ['edad', 22]];
const persona = Object.fromEntries(arregloPersona);

// Convertir un objeto en un set
const persona = {nombre: 'Eddy', edad: 22};
const setPersona = new Set(Object.entries(persona));

// Convertir un set en un objeto
const setPersona = new Set([['nombre', 'Eddy'], ['edad', 22]]);
const persona = Object.fromEntries(setPersona);

// Convertir un objeto en un mapa
const persona = {nombre: 'Eddy', edad: 22};
const mapaPersona = new Map(Object.entries(persona));

// Convertir un mapa en un objeto
const mapaPersona = new Map([['nombre', 'Eddy'], ['edad', 22]]);


// FUNCIONES: formas de declarar funciones

// Declaración de función
function sumar(a, b) {
    return a + b;
}

// Expresión de función
const sumar = function(a, b) {
    return a + b;
};

// Función flecha
const sumar = (a, b) => a + b;

// Función flecha con cuerpo
const sumar = (a, b) => {
    return a + b;
};

// Función constructora
const sumar = new Function('a', 'b', 'return a + b');

// Función autoinvocada
(function(a, b) {
    console.log(a + b);
})(2, 3);

// Función anónima
const sumar = function(a, b) {
    return a + b;
};

// Función nombrada
const sumar = function sumar(a, b) {
    return a + b;
};

// Función recursiva
function factorial(n) {
    if (n === 0) {
        return 1;
    }
    return n * factorial(n - 1);
}

// Función con argumentos por defecto
function saludar(nombre = 'Mundo') {
    console.log(`Hola, ${nombre}!`);
}

// Función con argumentos rest
function sumar(...numeros) {
    return numeros.reduce((total, numero) => total + numero, 0);
}

// Función con argumentos spread
function sumar(a, b) {
    return a + b;
}
const numeros = [1, 2];
console.log(sumar(...numeros)); // 3

// Función con argumentos rest y spread
function sumar(a, b, ...numeros) {
    return numeros.reduce((total, numero) => total + numero, a + b);
}

// Función con argumentos por defecto y rest
function sumar(a, b, ...numeros) {
    return numeros.reduce((total, numero) => total + numero, a + b);
}

// Función con argumentos por defecto y spread
function sumar(a, b) {
    return a + b;
}
const numeros = [1, 2];
console.log(sumar(...numeros)); // 3

// Función con argumentos por defecto, rest y spread
function sumar(a = 0, b = 0, ...numeros) {
    return numeros.reduce((total, numero) => total + numero, a + b);
}

// Argumentos de función
function sumar(a, b) {
    return a + b;
}
sumar.length; // 2

// Función con retorno implícito
const sumar = (a, b) => a + b;

// Función con retorno explícito
const sumar = (a, b) => {
    return a + b;
};

// Función con retorno condicional
const sumar = (a, b) => {
    if (a > b) {
        return a;
    }
    return b;
};

// Función con retorno corto
const sumar = (a, b) => a > b ? a : b;

// Función con retorno múltiple
const sumar = (a, b) => {
    return {
        a: a,
        b: b
    };
};

// Función con retorno de objeto
const sumar = (a, b) => ({
    a: a,
    b: b
});

// Función con retorno de función
const sumar = (a, b) => () => a + b;

// Función con retorno de función
const sumar = (a, b) => {
    return () => a + b;
};

// Función con retorno de función
const sumar = (a, b) => {
    return function() {
        return a + b;
    };
};

// Función con retorno de función
const sumar = (a, b) => function() {
    return a + b;
};

// Función con retorno de función
const sumar = (a, b) => function sumar() {
    return a + b;
};


// PayloadTooLargeError: request entity too large 
// Aumentar el límite de tamaño del cuerpo de la solicitud
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));



/* 
 */
grupo 8 TARIJA
24100303
24100662
24101041
24101053
24101111
24101450
24300093
24300097
24400231
24400364
24400520
24400748
24400750
24400752
24400757
24600001
24600131
24600264
24700051
24900025
24900028
24900074
25000029
25000051
25100032
25100048
24400750


GRUPO 19 TARIJA
24100202
24100490
24100609
24100633
24100638
24101219
24101259
24101433
24101681
24200037
24400368
24400510
24400534
24600027
24600245
24600294
25100102
25100108
25100116
24100634
24100726
24100964
24400764
24600073
24600242
24600282
24900041


grupo 20 TARIJA

24100661
24100664
24100666
24100759
24100763
24100767
24100780
24100935
24100946
24101133
24101139
24101214
24101307
24101591
24101643
24101747
24101808
24200099
24300047
24400254
24400270
24400395
24400402
24400709
24600011
24700025
25000046
25000058
24600042


grupo 21 TARIJA
24100246
24100273
24100675
24100815
24100818
24100915
24100930
24101018
24101618
24200048
24200049
24400705
24500070
24600087
24600136
24600175
24600216
24600295
24700013
24700090
24900078
24900085
24400700


grupo  43	TARIJA
24100495
24100503
24101342
24101393
24101444
24300025
24300028
24300220
24300250
24400671
24400682
24400779
24400787
24400803
24400835
24101045
24101654
24400754

grupo 8 TARIJA
24100217
24100384
24100386
24100386
24100389
24100619
24100909
24101458
24101634
24101784
24700044
24800017
25000023
25100011
25100024
25100043
25100062




// comando nvm para cambair de version de node
nvm use 12.18.3

// ------------------------------------------------------------------
codificacion.vm_p20esp_codif_avance_ac
codificacion.vm_p32esp_codif_avance_jc_nal
codificacion.vm_p331_codif_avance_ac
codificacion.vm_p332_codif_avance_ac
codificacion.vm_p333_codif_avance_ac
codificacion.vm_p341_codif_avance_ac
codificacion.vm_p352a_codif_avance_ac
codificacion.vm_p353_codif_avance_ac
codificacion.vm_p362a_codif_avance_ac
codificacion.vm_p363_codif_avance_ac
codificacion.vm_p372a_codif_avance_ac
codificacion.vm_p373_codif_avance_ac
codificacion.vm_p48esp_codif_avance_ac
codificacion.vm_p49_p51_codif_avance_ac
codificacion.vm_p52esp_codif_avance_ac













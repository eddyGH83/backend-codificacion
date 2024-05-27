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







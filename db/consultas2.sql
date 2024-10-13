-- tengo la tabla codificacion.cod_p49_p51, con los siguientes datos
-- | nro   | codigocodif_ocu | codigocodif_act | usucodificador_ocu     | usucodificador_act     |
-- | 1     | 4521            | 4521            | AUTOMATICO_NORMALIZADO | AUTOMATICO_NORMALIZADO |
-- | 2     | 450             | 450             | AUTOMATICO_NORMDOBLE   | AUTOMATICO_NORMDOBLE   |
-- | 3     | 402             | 402             | AUTOMATICO_NORMDOBLE   | AUTOMATICO_NORMDOBLE   |
-- | 4     | 452654          | 452654          | AUTOMATICO_NORMALIZADO | AUTOMATICO_NORMALIZADO |
-- | 5     | 452654          | 452654          | AUTOMATICO_NORMALIZADO |                 javier |


-- Tengo la tabla estructuras.estructuras.inicial0_capitulo_personas, con los siguientes datos
| nro   | p49_ocu | p51_act |
| 1     | null    | null    |
| 2     | null    | null    |
| 3     | null    | null    |

-- Se debe actualizar la tabla estructuras.estructuras.inicial0_capitulo_personas, con las siguientes condiciones:
-- 1. Si el campo p49_ocu es null, se debe actualizar con el valor 4521

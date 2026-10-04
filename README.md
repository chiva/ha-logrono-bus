# Logroño Bus para Home Assistant

[![Abrir en HACS](https://my.home-assistant.io/badges/hacs_repository.svg)](https://my.home-assistant.io/redirect/hacs_repository/?owner=chiva&repository=ha-logrono-bus&category=integration)

Estimaciones de paso de los **autobuses urbanos de Logroño** en Home Assistant: un sensor con la
próxima llegada y otro con los minutos que faltan, por cada línea y sentido de las paradas que
elijas. Para paneles, automatizaciones y widgets de Android.

> **Proyecto no oficial.** Usa el servicio web público del Ayuntamiento de Logroño a través de la
> librería [`logrono-bus`](https://github.com/chiva/logrono-bus).

## Instalación

> [!WARNING]
> **Aún no se puede instalar.** La librería `logrono-bus` 0.1.0 todavía no está publicada en
> PyPI y Home Assistant la instala desde ahí al arrancar la integración, así que la configuración
> fallaría. Este aviso desaparecerá con la primera versión publicada.

1. Con [HACS](https://hacs.xyz/): pulsa el botón de arriba (o añade este repositorio como
   *repositorio personalizado* de tipo **Integración**), descarga **Logroño Bus** y reinicia.
2. *Ajustes → Dispositivos y servicios → Añadir integración* → **Logroño Bus**.
3. En su tarjeta, **Añadir parada**: elige la parada (las más cercanas a casa primero) y las líneas.

Guía paso a paso, ejemplos y solución de problemas:
**[chiva.github.io/logrono-bus/guia/07-home-assistant](https://chiva.github.io/logrono-bus/guia/07-home-assistant/)**.

## Qué crea

| Entidad | Ejemplo | |
|---|---|---|
| Próxima llegada | `sensor.ayuntamiento_101_2_manresa_proxima_llegada` | Marca de tiempo |
| Minutos | `sensor.ayuntamiento_101_2_manresa_minutos` | Minutos que faltan |

Atributos: `linea`, `destino`, `color`, `color_texto`, `siguientes`, `tiempo_real`, `retraso_s`.
Del horario de hoy (salidas desde la cabecera): `servicio` (`antes`, `en_servicio`,
`terminado`, `sin_servicio`), `primera_salida`, `ultima_salida`, `proxima_salida`,
`frecuencia_min`, `frecuencia_max_min` y `salidas_desde`.

Un dispositivo por parada, con enlace al panel web de esa parada. Opciones: intervalo de
actualización (30–300 s, 60 por defecto) y cuántas llegadas considerar.

### Tarjeta para los paneles

La integración incluye y carga sola la tarjeta **`custom:logrono-bus-card`**, con el aspecto de la
web: color de cada línea, minutos grandes, orden por próxima llegada, aviso cuando el autobús está
cerca, modo pantalla para Echo Show o tablets y, al tocar, el recorrido con los autobuses en marcha.
Se configura con el editor visual (*Añadir tarjeta → Logroño Bus*) o en YAML:

```yaml
type: custom:logrono-bus-card
titulo: Casa
entities:
  - sensor.ayuntamiento_101_2_manresa_minutos
  - sensor.ayuntamiento_101_10_manuel_de_falla_minutos
orden: llegada
aviso: 3
modo: pantalla
```

### Aviso cuando llega el autobús (blueprint)

[![Importar el blueprint](https://my.home-assistant.io/badges/blueprint_import.svg)](https://my.home-assistant.io/redirect/blueprint_import/?blueprint_url=https%3A%2F%2Fgithub.com%2Fchiva%2Fha-logrono-bus%2Fblob%2Fmain%2Fblueprints%2Fautomation%2Flogrono_bus%2Faviso_llegada.yaml)

[`blueprints/automation/logrono_bus/aviso_llegada.yaml`](blueprints/automation/logrono_bus/aviso_llegada.yaml):
notifica al móvil (o a cualquier entidad `notify`) cuando a una línea le faltan menos de N minutos,
en el horario y los días que elijas, solo con el autobús localizado y sin repetir el aviso por el
mismo autobús. Admite acciones extra con el texto del aviso en `{{ mensaje }}`.

## Calidad

- Configuración por interfaz, una subentrada por parada, reconfigurable.
- Avisos en *Reparaciones* si el servicio del Ayuntamiento cambia o una parada desaparece.
- Diagnósticos descargables. Errores y textos traducidos (español).
- Librería asíncrona, tipada y con la sesión HTTP de Home Assistant.
- [Autoevaluación de calidad](custom_components/logrono_bus/quality_scale.yaml): nivel oro.

## Desinstalar

Elimina la integración en *Dispositivos y servicios* y, después, desde HACS.

## Desarrollo

```bash
uv sync                    # Home Assistant de pruebas + herramientas
uv run pytest --cov        # tests (pytest-homeassistant-custom-component, syrupy)
uv run ruff check . && uv run mypy
```

Mientras `logrono-bus` no esté publicado en PyPI, `uv` lo instala desde un commit fijo de
[chiva/logrono-bus](https://github.com/chiva/logrono-bus) (ver `[tool.uv.sources]` en
`pyproject.toml`). Para probar cambios de la librería sin publicarlos:
`uv pip install -e ../logrono-bus/packages/logrono-bus`.

## Ecosistema

- [logrono-bus](https://github.com/chiva/logrono-bus): librería, web, modo pantalla y servidor.
- **ha-logrono-bus** (este repositorio): integración para Home Assistant.

## Licencia

[MIT](LICENSE).

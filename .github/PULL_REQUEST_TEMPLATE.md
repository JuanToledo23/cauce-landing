## ¿Qué hace este PR?

<!-- Descripción breve -->

## Checklist de auditoría CAUCE (AP-01 a AP-19)

### IDENTIDAD VISUAL
- [ ] ¿No hay gradiente decorativo en ningún background? → AP-01
- [ ] ¿No hay imagen de stock? → AP-02
- [ ] ¿No hay font-family: Inter en ninguna regla CSS? → AP-03
- [ ] ¿No hay @media (prefers-color-scheme: dark)? → AP-04
- [ ] ¿No hay canvas, particles.js, @keyframes decorativos? → AP-05

### ICONOGRAFÍA
- [ ] ¿No hay <Icon /> como elemento primario en servicios/metodología? → AP-06
- [ ] ¿No hay iconografía de IA (cerebros, chips, redes)? → AP-07
- [ ] ¿Ningún elemento "parece agua"? → AP-08
- [ ] ¿No hay border-top/border-bottom entre ítems de lista? → AP-09

### ESTRUCTURA
- [ ] ¿No hay dos botones de igual peso en la misma sección? → AP-10
- [ ] ¿No hay rounded-* en ningún Button o Input? → AP-11
- [ ] ¿No hay selector de track en hero o nav? → AP-12
- [ ] ¿No hay texto "próximamente" visible? → AP-13

### PRUEBA SOCIAL
- [ ] ¿No hay logo wall con filter:grayscale? → AP-14
- [ ] ¿No hay redes sociales sin perfil activo? → AP-15
- [ ] ¿No hay testimonios sin nombre+cargo+empresa? → AP-16

### COPY
- [ ] ¿No hay oraciones de más de 20 palabras? → AP-17
- [ ] ¿No hay palabras del vocabulario prohibido (§4.1 PDD)? → AP-17
- [ ] ¿No hay calcos del inglés fuera de las 3 categorías permitidas? → AP-18
- [ ] ¿Los ítems de listas NO comparten exactamente el mismo className? → AP-19

**Resultado:** ___/19 · Si hay 1+ fallados: no hacer merge.
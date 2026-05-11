# Beets Groep 8 Eindfeest, concept

## Distributie

Elk kind krijgt een fysiek kaartje met een QR code. De QR linkt naar de
website (deze repo). Tekst op het kaartje:

> Kom je ook naar het eindfeest? Benieuwd naar het thema?
> Scan en ontdek het.

## Scroll flow op de site

De hele beleving is één scroll-driven scene. Geen klikken, geen menu,
gewoon scrollen en het verhaal ontvouwt zich.

1. **Intro frame**
   "Beets groep 8 eindfeest"
   Rustig, ingetogen, nog geen hint van het thema.

   Een schattig cartoon vliegtuigje vliegt langzaam van links naar
   rechts over het scherm en sleept een banner achter zich aan met de
   tekst "Beets Groep 8 Eindfeest". Propeller draait, vliegtuigje wiebelt
   subtiel op en neer, banner wappert iets in de wind. Triggert op
   mount (niet scroll-gebonden), duurt ongeveer 8 tot 10 seconden zodat
   de tekst goed leesbaar is. Daarna verdwijnt het vliegtuigje aan de
   rechterkant en blijft de scene leeg achter, klaar voor de
   thema-reveal.

2. **Tromgeroffel + thema reveal**
   Geluid van drumroll, korte build-up animatie, dan klapt het thema
   op het scherm.

3. **Zoom in**
   Camera zoomt door het zojuist onthulde thema heen, alsof je het
   strand in wordt getrokken.

4. **Strand scene**
   Tropisch strand met palmen als basis. Daarop animeren los meerdere
   objecten in, elk met een eigen entry-animatie en moment in de scroll
   timeline:

   - Flamingo (drijver of staand)
   - Ananas
   - Surfbord
   - Strandstoel
   - Poppetje in zwembroek, dat vervolgens de dresscode-accessoires
     stuk voor stuk aankrijgt:
     - Hawai-shirt aan
     - Hawai-slinger om de nek
     - Glaasje limonade met rietje in de hand

   Het poppetje fungeert dus als dresscode-uitleg: kinderen zien stap
   voor stoer hoe ze zich kunnen aankleden voor het feest.
   Pixar-stijl, kleurrijk.

5. **Confetti + titel**
   Confetti regen over het scherm met de woorden "Summer Beach Party"
   groot in beeld.

6. **Uitnodiging**
   "Kom jij ook?" als grote vraag aan de bezoeker.

7. **Praktisch**
   Datum, tijd, locatie in compacte info-pills.

8. **RSVP**
   Formulier om aan te geven of je erbij bent.
   Submit triggert nog een korte confetti burst en bevestigingsscherm.

## Technische opzet (voorlopig)

- Next.js 16 App Router
- GSAP ScrollTrigger met pinning en scrub voor de hele intro
- Veo 3.1 video als Pixar-style beach intro (8s, scrub op currentTime)
- Phosphor icons voor functionele iconografie
- Eventueel avatars van kinderen als overlay sprites op het strand

## Open punten

- Welk geluid voor de tromgeroffel, en hoe gaan we om met autoplay
  audio policies op mobiel? (Waarschijnlijk muted start, geluid bij
  eerste tap / scroll gesture)
- Avatars: foto's of geïllustreerd? Toestemming ouders nodig
- RSVP backend: form endpoint, e-mail notificatie, of gewoon een
  Google Sheet via Sheety / Formspree
- Hosting + domein voor de QR code

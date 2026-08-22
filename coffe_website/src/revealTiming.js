/* ── The order the page arrives in ────────────────────────────────────────
   Seconds, measured from the moment Intro's curtain has cleared the top of the
   screen and fires `onReveal`. Three separate components animate off these —
   Navbar, useHeroEntrance and BottomInfo — each with its own timeline, so this
   file is the only place the sequence actually exists as a sequence. Read it as
   a storyboard; change the storyboard here, not in the components.

     navbar    the bar arrives first, because it is the strip the rising
               curtain uncovers last and the eye is already at the top
     beans     then the coffee beans fall in from above
     wordmark  then COFFEE rises out of its clip box
     panel     the notes, pills and badges under the arc
     cups      and last the product itself, popping up off the cream

   Every one of these is an offset into its own component's timeline rather
   than a `delay` on it. A paused root timeline does not honour `delay` the way
   a nested one does, and all three of these are built paused at unveil and
   played at reveal — see the two-effect arm/play split in each component. */
export const REVEAL = {
  navbar: 0,
  beans: 0.45,
  wordmark: 1.05,
  panel: 1.45,
  cups: 1.55,
}

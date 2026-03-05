# TeamOne Accessibility Audit Checklist

## WCAG 2.1 AA Compliance Verification

### Level A (Must Pass)

#### Perceivable
- [ ] 1.1.1 Non-text Content: All images have alt text
- [ ] 1.2.1 Audio-only and Video-only: Alternatives provided
- [ ] 1.3.1 Info and Relationships: Semantic HTML used
- [ ] 1.3.2 Meaningful Sequence: Reading order is logical
- [ ] 1.3.3 Sensory Characteristics: Not solely reliant on color/shape
- [ ] 1.4.1 Use of Color: Color is not the only visual means of conveying information
- [ ] 1.4.2 Audio Control: Audio can be paused/stopped
- [ ] 1.4.3 Contrast (Minimum): 4.5:1 for normal text, 3:1 for large text
- [ ] 1.4.4 Resize Text: Text can be resized up to 200%
- [ ] 1.4.5 Images of Text: Text is used instead of images where possible

#### Operable
- [ ] 2.1.1 Keyboard: All functionality available from keyboard
- [ ] 2.1.2 No Keyboard Trap: Keyboard focus can be moved away
- [ ] 2.2.1 Timing Adjustable: Time limits can be adjusted
- [ ] 2.2.2 Pause, Stop, Hide: Moving content can be paused
- [ ] 2.3.1 Three Flashes: No content flashes more than 3 times
- [ ] 2.4.1 Bypass Blocks: Skip links provided
- [ ] 2.4.2 Page Titled: Pages have descriptive titles
- [ ] 2.4.3 Focus Order: Focus order is logical
- [ ] 2.4.4 Link Purpose: Link purpose is clear from context
- [ ] 2.5.1 Pointer Gestures: Single pointer gestures work
- [ ] 2.5.2 Pointer Cancellation: Actions can be cancelled
- [ ] 2.5.3 Label in Name: Visible label matches accessible name
- [ ] 2.5.4 Motion Actuation: Motion can be disabled

#### Understandable
- [ ] 3.1.1 Language of Page: Language is specified
- [ ] 3.1.2 Language of Parts: Language changes are specified
- [ ] 3.2.1 On Focus: No context change on focus
- [ ] 3.2.2 On Input: No context change on input
- [ ] 3.2.3 Consistent Navigation: Navigation is consistent
- [ ] 3.2.4 Consistent Identification: Components are consistently identified
- [ ] 3.3.1 Error Identification: Errors are identified
- [ ] 3.3.2 Labels or Instructions: Labels/instructions provided
- [ ] 3.3.3 Error Suggestion: Error suggestions provided
- [ ] 3.3.4 Error Prevention: Errors can be reversed

#### Robust
- [ ] 4.1.1 Parsing: Valid HTML
- [ ] 4.1.2 Name, Role, Value: ARIA attributes used correctly
- [ ] 4.1.3 Status Messages: Status messages announced

### Level AA (Should Pass)

#### Perceivable
- [ ] 1.2.4 Captions (Live): Live captions provided
- [ ] 1.2.5 Audio Description: Audio description provided
- [ ] 1.4.5 Contrast (Enhanced): 7:1 for normal text, 4.5:1 for large text
- [ ] 1.4.9 Images of Text (No Exception): No images of text
- [ ] 1.4.10 Reflow: Content reflows at 320px
- [ ] 1.4.11 Non-text Contrast: 3:1 for UI components
- [ ] 1.4.12 Text Spacing: Text spacing can be adjusted
- [ ] 1.4.13 Content on Hover or Focus: Content can be dismissed

#### Operable
- [ ] 2.4.5 Multiple Ways: Multiple ways to find pages
- [ ] 2.4.6 Headings and Labels: Descriptive headings and labels
- [ ] 2.4.7 Focus Visible: Focus indicator is visible
- [ ] 2.5.5 Target Size: Touch targets are 44x44px minimum
- [ ] 2.5.6 Concurrent Input Mechanisms: Multiple input methods supported

#### Understandable
- [ ] 3.1.3 Unusual Words: Jargon explained
- [ ] 3.1.4 Abbreviations: Abbreviations explained
- [ ] 3.1.5 Reading Level: Lower secondary reading level
- [ ] 3.1.6 Pronunciation: Pronunciation provided
- [ ] 3.2.5 Change on Request: No context change without request
- [ ] 3.3.5 Help: Context-sensitive help provided
- [ ] 3.3.6 Error Prevention (Legal, Financial, Data): Confirmation provided

---

## Automated Testing Commands

```bash
# Install axe-core
npm install -g @axe-core/cli

# Run axe-core on localhost
axe http://localhost:3000

# Install pa11y
npm install -g pa11y

# Run pa11y
pa11y http://localhost:3000 --standard WCAG2AA

# Install lighthouse
npm install -g lighthouse

# Run lighthouse accessibility audit
lighthouse http://localhost:3000 --only-categories=accessibility
```

---

## Manual Testing Checklist

### Keyboard Navigation
- [ ] Tab through all interactive elements
- [ ] All elements are reachable
- [ ] Focus is visible
- [ ] Focus order is logical
- [ ] No keyboard traps
- [ ] Skip links work
- [ ] Custom components are keyboard accessible

### Screen Reader Testing
- [ ] Install NVDA (Windows) or VoiceOver (Mac)
- [ ] Navigate through page
- [ ] All content is announced
- [ ] Form fields have labels
- [ ] Images have alt text
- [ ] Links have descriptive text
- [ ] Dynamic content changes are announced

### Color Contrast
- [ ] Use WebAIM Contrast Checker
- [ ] All text meets 4.5:1 ratio
- [ ] All large text meets 3:1 ratio
- [ ] UI components meet 3:1 ratio

### Mobile Accessibility
- [ ] Touch targets are 44x44px minimum
- [ ] No horizontal scrolling
- [ ] Content reflows at 320px
- [ ] Gestures have alternatives

---

## Tools & Resources

### Automated Tools
- axe-core: https://www.deque.com/axe/
- WAVE: https://wave.webaim.org/
- Lighthouse: https://developers.google.com/web/tools/lighthouse
- pa11y: https://pa11y.org/

### Manual Testing Tools
- NVDA: https://www.nvaccess.org/download/
- VoiceOver: Built into macOS
- Color Contrast Analyzer: https://www.webaim.org/resources/contrastchecker/

### Guidelines
- WCAG 2.1: https://www.w3.org/WAI/WCAG21/quickref/
- ARIA Authoring Practices: https://www.w3.org/WAI/ARIA/apg/

---

## Status

**Last Audit Date:** Not yet audited  
**Overall Compliance:** Not yet verified  
**Critical Issues:** Unknown  
**Action Required:** Schedule formal accessibility audit

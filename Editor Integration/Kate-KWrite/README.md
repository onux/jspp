# JS++ Integration for Kate and KWrite

This plugin provides JS++ integration for the Kate text editor (and KWrite) on the KDE desktop environment for Linux. Syntax highlighting, code folding, TODO comments, and documentation comments are supported. This plugin will also install JS++ for KWrite in addition to Kate.

## Installation

1. Copy `jspp.xml` to your Kate/Kwrite syntax directory. Depending on your version of Kate/Kwrite, it can be any one of these directories:

`~/.local/share/katepart5/syntax/`
`~/.kde/share/apps/katepart/syntax/`
`/usr/share/kde4/apps/katepart/syntax/`

2. Restart Kate (or Kwrite).

3. All files ending in .jspp should automatically be highlighted with JS++. If not, select from the menu: Tools -> Mode -> Sources -> JS++.

## Additional Notes

The JS++ plugin for Kate and KWrite are theme-independent. Thus, some keywords are simply bolded rather than being colored with a specific style. If your font does not support bolding, it may appear much of the syntax is not being highlighted. For example, Kate and KWrite on Kubuntu will use the "Oxygen Mono" font as the default font for most themes. "Oxygen Mono" does not support bolded text and switching the font to "Ubuntu Mono" will fix this problem.
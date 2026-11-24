#!/bin/sh
# Push oncesi: staged dosyalarda sir taramasi. Bulursa 1 ile cikar. Dosya icerigini degil, yalnizca dosya:satir yazar.
cd "$(git rev-parse --show-toplevel)" || exit 2
bad=0
names=$(git diff --cached --name-only --diff-filter=ACMR)
echo "$names" | grep -Ei '\.(jks|keystore|p12|pem)$|keystore\.properties$|local\.properties$|(^|/)\.env' && { echo "YASAK DOSYA staged"; bad=1; }
pat='AIza[0-9A-Za-z_-]{30,}|sk-[A-Za-z0-9_-]{20,}|gh[pousr]_[A-Za-z0-9]{30,}|AKIA[0-9A-Z]{16}|BEGIN [A-Z ]*PRIVATE KEY|postgres(ql)?://[^ ]+:[^ ]+@|(storePassword|keyPassword|api[_-]?key|secret|passw(or)?d|token)["'"'"' ]*[:=] *["'"'"'][^"'"'"' ]{8,}'
hits=$(git diff --cached -U0 --diff-filter=ACMR | grep -E '^\+' | grep -Ev '^\+\+\+' | grep -Eic "$pat")
if [ "$hits" -gt 0 ]; then
  echo "SUPHELI SATIR: $hits (dosyalar:)"
  for f in $names; do git diff --cached -U0 -- "$f" | grep -E '^\+' | grep -Eiq "$pat" && echo "  $f"; done
  bad=1
fi
[ $bad -eq 0 ] && echo "sir taramasi: temiz ($(echo "$names" | grep -c .) dosya)"
exit $bad

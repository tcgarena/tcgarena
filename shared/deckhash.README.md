# deckhash explained

  The deckhash function is tricky because it needs to be just right for it to work.
  It's also extremely important for making sure users aren't coming to ranked events with the wrong deck.
  I'm leaving this here to help everyone understand how the function works, just in case it needs to be adjusted in the future.


### gitter converstion from the cockatrice repo

Ben Wagner @benjaminpwagner Aug 06 (2018) 17:25
Hello, I'm trying to find the code or algo used to generate deck hash from decklist. I'm using NodeJS. Can anyone point me in the right direction?

Gavin Bisesi @Daenyth Aug 07 07:26

```
void DeckList::updateDeckHash()
{
    QStringList cardList;
    bool isValidDeckList = true;
    QSet<QString> hashZones, optionalZones;

    hashZones << DECK_ZONE_MAIN << DECK_ZONE_SIDE; // Zones in deck to be included in hashing process
    optionalZones << DECK_ZONE_TOKENS;             // Optional zones in deck not included in hashing process

    for (int i = 0; i < root->size(); i++) {
        auto *node = dynamic_cast<InnerDecklistNode *>(root->at(i));
        for (int j = 0; j < node->size(); j++) {
            if (hashZones.contains(node->getName())) // Mainboard or Sideboard
            {
                auto *card = dynamic_cast<DecklistCardNode *>(node->at(j));
                for (int k = 0; k < card->getNumber(); ++k) {
                    cardList.append((node->getName() == DECK_ZONE_SIDE ? "SB:" : "") + card->getName().toLower());
                }
            } else if (!optionalZones.contains(node->getName())) // Not a valid zone -> cheater?
            {
                isValidDeckList = false; // Deck is invalid
            }
        }
    }
    cardList.sort();
    QByteArray deckHashArray = QCryptographicHash::hash(cardList.join(";").toUtf8(), QCryptographicHash::Sha1);
    quint64 number = (((quint64)(unsigned char)deckHashArray[0]) << 32) +
                     (((quint64)(unsigned char)deckHashArray[1]) << 24) +
                     (((quint64)(unsigned char)deckHashArray[2] << 16)) +
                     (((quint64)(unsigned char)deckHashArray[3]) << 8) + (quint64)(unsigned char)deckHashArray[4];
    deckHash = (isValidDeckList) ? QString::number(number, 32).rightJustified(8, '0') : "INVALID";

    emit deckHashChanged();
}
```

so basically
for each card in main zone or sideboard zone in the decklist
construct a string with the concatenated card names
with SB: prefixed to the name of sb cards
once you have that string
take the sha1
as an array of bytes
take the first 5 bytes
and then interpret them as numbers
I'd have to look up the documentation on some of the functions to be more specific
QString::number I forget what second arg means

Ben Wagner @benjaminpwagner Aug 07 10:51
@Daenyth so when you say an array of bytes, you mean to split up to 40 char sha1 into 8 character segments?

Gavin Bisesi @Daenyth Aug 07 11:07
a sha1 isn't a string
it's a number
it has a hexadecimal representation
but the hex string isn't the sha1
so it's taking that sha1's raw bytes
it'll be easy to test if your thing works: take a single deck file, open in cockatrice note the hash, and then you can write a unit test in your app that asserts that file has that hash
one file will be enough to know it works, because hashing is involved
if you do anything at all wrong it will be a total mismatch

Ben Wagner @benjaminpwagner Aug 07 11:15
okay so I've converted the hex representation and i'm getting a massive number, 8.x e^47
is this normal?

Gavin Bisesi @Daenyth Aug 07 11:21
sha1 output is 20 bytes

Ben Wagner @benjaminpwagner Aug 07 11:23
so the deck hash function only uses the first 5 bytes? or am i missing something

Gavin Bisesi @Daenyth Aug 07 11:30
yes
that's right
if I read the code right

Ben Wagner @benjaminpwagner Aug 07 11:31
okay i have my decklist as an array of bytes, I shift them according to the above and add them together... then what? i see nothing in the above code that converts it back into hex

Gavin Bisesi @Daenyth Aug 07 11:32
QString::number
turns the number into a string
we make a 64bit int
and convert that to a number
forget what the 32 is doing

Ben Wagner @benjaminpwagner Aug 07 11:41
are you familiar with js? i'm fairly close to making it work but i'm not sure that my shifts are working properly. as far as i can tell, the << operator works the same in JS as c++

Gavin Bisesi @Daenyth Aug 07 11:41
I don't know js beyond a passing level
but like I said, unit test will be very easy to write

Ben Wagner @benjaminpwagner Aug 07 11:42
ya its failing the test
keeps coming out as negative, even after converting back to hex

Gavin Bisesi @Daenyth Aug 07 11:49
casting to unsigned char
might be doing something

Ben Wagner @benjaminpwagner Aug 07 11:50
i was wondering about that too but it looks like js handles the type natively
am i right that the decklist should follow this format before sha1: '1 ancestral recall;SB:1 black lotus'

Gavin Bisesi @Daenyth Aug 07 12:01
oh are you sorting the card list
I believe it's sorted by something
sec
sort by name first
ascending by raw cardname

Ben Wagner @benjaminpwagner Aug 07 12:38
letters first or numbers first?

Gavin Bisesi @Daenyth Aug 07 12:40
if the card name starts with a number it's just ascii-like ordering
if you mean card count you need to duplicate
a deck of 2 island hashes IslandIsland

```
for (int k = 0; k < card->getNumber(); ++k) {
    cardList.append((node->getName() == DECK_ZONE_SIDE ? "SB:" : "") + card->getName().toLower());
}
```

lowercase also
and with the SB: prepend if it's that zone


## notes

  - this was enough info to build it, the only problem was javascript not supporting large enough numbers.
  thankfully theres packages for this, we are using jsbn https://www.npmjs.com/package/jsbn


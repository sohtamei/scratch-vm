/* copyright (C) 2021 SohtaMei. */
//	SSD1306 parameters from lovyanGFX (based on Panel_SSD1306.hpp/cpp)
//	errorDiffusion from ltzz氏 https://qiita.com/ltzz/items/2160b5a73c206e14bde3

var extName = 'i2cLCD';			// _ などの記号厳禁

const ADRS_SSD1306			= 0x3C;

// fundamental command

const CMD_SETCONTRAST		= 0x81;
const CMD_DISPLAYALLON_RESUME = 0xA4;
const CMD_DISPLAYALLON		= 0xA5;
const CMD_NORMALDISPLAY		= 0xA6;
const CMD_INVERTDISPLAY		= 0xA7;
const CMD_DISP_OFF			= 0xAE;
const CMD_DISP_ON			= 0xAF;

// scrolling command

const CMD_DEACTIVATE_SCROLL	= 0x2E;

// addressing setting command

const CMD_SETCOL_LOW	= 0x00;
const CMD_SETCOL_HIGH	= 0x10;
const CMD_MEMORYMODE	= 0x20;
const CMD_COLUMNADDR	= 0x21;
const CMD_PAGEADDR		= 0x22;
const CMD_SETPAGE0		= 0xB0;

// hardware configuration command

const CMD_SETSTARTLINE	= 0x40;
const CMD_SEGREMAP		= 0xA0;
const CMD_SETMULTIPLEX	= 0xA8;
const CMD_COMSCANINC	= 0xC0;
//nst CMD_COMSCANDEC	= 0xC8;
const CMD_SETOFFSET		= 0xD3;
const CMD_SETCOMPINS	= 0xDA;

// timing & driving scheme setting

const CMD_SETCLKDIV		= 0xD5;
const CMD_SETPRECHARGE	= 0xD9;
const CMD_SETVCOMDETECT	= 0xDB;

// charge pump setting

const CMD_CHARGEPUMP	= 0x8D;

const TFT_BLACK       = 0x0000;      /*   0,   0,   0 */
const TFT_NAVY        = 0x000F;      /*   0,   0, 128 */
const TFT_DARKGREEN   = 0x03E0;      /*   0, 128,   0 */
const TFT_DARKCYAN    = 0x03EF;      /*   0, 128, 128 */
const TFT_MAROON      = 0x7800;      /* 128,   0,   0 */
const TFT_PURPLE      = 0x780F;      /* 128,   0, 128 */
const TFT_OLIVE       = 0x7BE0;      /* 128, 128,   0 */
const TFT_LIGHTGREY   = 0xD69A;      /* 211, 211, 211 */
const TFT_LIGHTGRAY   = 0xD69A;      /* 211, 211, 211 */
const TFT_DARKGREY    = 0x7BEF;      /* 128, 128, 128 */
const TFT_DARKGRAY    = 0x7BEF;      /* 128, 128, 128 */
const TFT_BLUE        = 0x001F;      /*   0,   0, 255 */
const TFT_GREEN       = 0x07E0;      /*   0, 255,   0 */
const TFT_CYAN        = 0x07FF;      /*   0, 255, 255 */
const TFT_RED         = 0xF800;      /* 255,   0,   0 */
const TFT_MAGENTA     = 0xF81F;      /* 255,   0, 255 */
const TFT_YELLOW      = 0xFFE0;      /* 255, 255,   0 */
const TFT_WHITE       = 0xFFFF;      /* 255, 255, 255 */
const TFT_ORANGE      = 0xFDA0;      /* 255, 180,   0 */
const TFT_GREENYELLOW = 0xB7E0;      /* 180, 255,   0 */
const TFT_PINK        = 0xFE19;      /* 255, 192, 203 */ //Lighter pink, was 0xFC9F
const TFT_BROWN       = 0x9A60;      /* 150,  75,   0 */
const TFT_GOLD        = 0xFEA0;      /* 255, 215,   0 */
const TFT_SILVER      = 0xC618;      /* 192, 192, 192 */
const TFT_SKYBLUE     = 0x867D;      /* 135, 206, 235 */
const TFT_VIOLET      = 0x915C;      /* 180,  46, 226 */
const TFT_TRANSPARENT = 0x0120;

const PREFIX_CMD  = 0x00;
const PREFIX_DATA = 0x40;


const IconURI = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFAAAABQCAYAAACOEfKtAAAACXBIWXMAACcQAAAnEAGUaVEZAAAbJklEQVR4nOzbeVTU573H8Z57e8+55957LmmMTdNck9Q2N43tbdokbdO0MTG3JsE1imKi4lIblwgCrsFlUH8/YICBYYdhR5aAIPswsqPDvm8jmyIysruQmlC1zrzvH4RRwoCoUJL0cs7nH+Y3M8/zOt/n+T3zPDPfAb7z/3n4zHgDvumZ8QYYyb8Cz9E/uIOkYiaVvLpWYB7wH/9YgBd759Os/Zhmre+1vDMZaolVnVpiNaCWWN1Js1mtl697kVPue8dN9LFNeK6ai/qIJWqJlU4tseodiEkspVnrT3uP6bcT8MbQkzRrt9CsDa6Ri9fVEiu9WmJFirUZkZL1JLjZGqIKk9GkaR031SVFRB3dgMz8RyS42eK58SWSLJdR5XgYlBWf0ax15LMvnv42AH4XmMvF3jVXcvJyCyXW+kKJNR5mc4mSWJAgsyFBZkNVkXpCMGOpKSkiwW035QXZZEV64bnxJdxXPkOhxJqB0Fg95S1naO9ZA/z7NxXw38itTSGlZDDI4mWd4+LHCd27DE2dBk2dhqbGlgdG+2pKstPJjQukSdPKuYZzaOo0lOZk4Lj4cZyWPEGjq6OO7Jp84KlvHuDlKzsC1//qlnTJbML2r6CxtgFN/blHRhsP0JDGFhprGwi3W43/Bz+DpGI9qaUDdPZvB773jQAcaKhekGKz6i/+u1cQL7OluqRoSuHuBYw8spaKgpwxj2nqNWRFenHSYRseZj+i5Pje233hsReoPi/9egP+ZWh2w6eKYNHUhISIYGRr51GWd3paAKtLivCw+Dk5sYpxr6mrqCROuhOvzS9zaudS+iLihmjv/ehrCzhQUOCevGuF3vXDFwk5toNAu/VUFRVOC2CTppXQfcsnBBxJVrQPXptfJs1mNaSVfc7F3v08wvpx2gAbfGX1PpbvcsLVjpMhvtRU1lFcWDYpjNzsApRpp0clN7tgSgCbNK001jYQJVmH3wfzIKn4Czr63vt6AebVpTS4ijrfXYtITUrFbcMvSYwMo0hdijLtNAV5d5crOVn5Y7DSU1WkpWSMSnqqasx1OVn5NGlah++4S2ZNGrBJ00rl2TwcFj2G3wfz9LT3uH59AC/1m6IsHzhhtZTgI1sIsd9KTloyZwsKyc0uoEhdSkGemoz0TDLSM4lylxDmYH3fRMntjaJmpGeSEK5ANDUhNcSd8tKqSQHWV1UTZW+By7If0Bce+xkdfW9/HQC/S2ZVab2LQMC2BfjuWkRcsA9JsZ9SpC5FpcziVGQYYQ42hjivnovL+udQyBZPGI8dvx71vDAHGyLdJaSlZHAy1B/R1IQo+VFUyixKiysoLa6gvlYzIWJNSTGiqQmVDgf1XOg58HUAfIbMql4f8xdQHPiQwIMbiPF1NlRMpNsR/HevwGXDXAJcFxkSEfMnlL2hEyY8ctOo57isfw6X1T8m3NGWwEMbDYD3VuiZ/MIJIe8BhPKWs3z2xQMvtKcWUDswn+SSz33MX8BxyRP42S4nOT4B+ebfIF35DN4H/0BKqyep7b73BbtfUtt9SWn1JKXVk9h8O0RTE5yWP4V05TNIVz6DfPNvDJDKtNNknc4dA3iusZmyXBWuy56iVnr0Nhd6Vs4s4KU+q9ANv9Y5Lvoeik/W4bh0Ns5mz+Kw+HHizhyaEjhjSe8KIrnFw5C4M4dwWPw4zmbPEuVxtyqNIdaUliKamlAh2um50CPOHOCNoSepasv0Nn8e0dQEhb05/tJ3CY/cRHKznPSu4GnBMw4aTHKznPDITQTKVxLosgLZ2p8R6X6EswVFhiF9rrEFdXb2CCBUtMZzocf5jrI0t0YuXuyLjq+m+vzhvw9gR9+mq+Hxt9xWzEE0NSEsYuPfDex+SWnzwtf+TaQr/osI530k+gmowlxRhjgTKlgimpqQbPU+NVJ7aqT2VDodRnb4D5yyt6AvPLZ0+gFvDL14Ne9MZprNanwkb+LvuJCUNq8ZhxuN6I2/40JcN/0E0dQEx+Wz8T36FqKpiSFyy1/g77iQANfFKKqOIx76HSXC3gvTDThLo/Aod1sxRy/u+gVJHX4zjjUh5HlvkjQy/I6/jfv2n5GkkRmS2uGPsjeU1O4gHLOsRwCvTyfgLArq0xXrXtKJu36BT94+0ntCZhxp8pBuY/6f2hWEc+5uBJXlCKB2egBvDP2Y3NqSsE2v6RzEt3FR7iRC4zLjMA+atEv+BAeY43XgNVwkb+ASYIag/BjR9pcE//l3tPl4V08PYHvPn5vcXW+77nkNIXkrfuX2M47xKIlM2I7PkfmIy2YhyN4j2OIV2jw9oaA+aeoBb/z1hav5Z7Jcl/8QIWELgsryGw84Uo0+R+YjmppQenzf8JFpa5fD1AJ29i8mo+JypcNBvRC6BkG581sDqOwNRdkdQnzpMeQrn6VWehROVzUDT0wdYHZNQaOrI3K7BQa8bxVgbyjKnhBOVTsR4b6aWulRPXl1WeMhPhhe99U3GuTSQQ+7BYahK6gs8S45TLJWMfMdn+Ikt3iSEG9Ls1ymJ68uB/iXRwH8T9LLG1XHtyHI3jXgCSpL/MuPznhnpytpnQFIl8yG5JJb3Bj67cMD9lz7kLSyIZn9H0fhPQhgbn8slddzqbyeS2Zf1IzjTCbplwPxO/wmLR7uUNmax42hHzwM4GzSyzojNv8eRdbeMYBO2TYE1zrctzFXbnUDcOVWN6f7ImYcZ9LpCSG+5Bg1TvZ6mrU7Hxywc2AHySV/k73/NNL0j8cATuYm0nOzA53+DgC9NztmHuUhKrFQYg2qyi4u9i6YPGBn/9vXT6ZfTXTbTIjKFgcjeCNV6F9+lLRu49tWl4aa6LvZyYXP68kfiJ/SzqV2BRHTIp/eG1lPCFEeH1IjtYdm7bHJAX7+19nXzxQGpNuuIfWiH45Z1kbx7s2Jc66kdQeT3CQnoVyY1qpI7QoiplVOeJWI4L+CoMJD04oY5GuGWmIFlW1pkwNs7TpYcmyPzsXiR6RdCpgU4AhiTO4BQsPWTytgVJMbQso2BOeFiKYmCD7LiG52n9RzVX0RlF5TPdD7RSZs57TDVq5FnKqbDOBjDX5uGu/VzxPosRxlb+ikAUXL/yHx3NidjqmKouo47mcP4Bi3GXH9s4b9vIkAc/pjR829rTeq0aGj/6b2gd472G8VaonVAMPfpJ0AUN2YXHJsj9732AKSGmV4Fh5EPG01OcA1T5NY7zqpBp1UHyHQc/mkO3Cq4+5UIu7/NX4bXuSS0oeInb9DXDsHz7ixJ3y5/bEM3r6CTn+HiuvZKHtD6RxqAeCmbuhhAO8Az40P2D/4KiklX8R6biCpUfZA1TdZwJPF9sTmfUJkwnZOVTuOe118uw+xbZ74lkmQn/0EWcE+hBNrEfe8TIzdu3TnhKBrK+TkvuFh7KxYxckL3mOGa8X1bAZudVF+LRNlbyjNNyoB0KGj8nrugwEesdLTP7h2PMB/JqWkpcMvgKi47Sh7Q0nqDMAhc9fkAEPXID/wGsnNHsbR8u2IzbfD9+gCPHe/SmKt85jrUruCiG3zJLbNcxhs5LVTtiEErULc9GMCt7xE52l/dB2V6AfaDYCC91Kcc3ePQTRWlSN/jZ8Vo+wNJb0nhLjzEx9FnIjfRqa4DZKKB8cDfJaUkr9Kl8wmrTMAZW8oYfXSyVef+Q9JapCNraTio7hsfRHpjnl42L5CYr3xzdf4dh/j7/flzcJ1xQ84Yfk6nSo/dO1lMNgNVzrIl2/FfdUcBIe3EVSWuObvHXcKSNYqyO6P5trtPnR6HZXXc1D2hpKiVeAY/uF9qzAkwHx4q8soYOfAIpKL70wroKspiZf8R1dnuzceartxpwpx7ysEbP45l7MU6LX16Pva4Jp2GHCwG117GfH730Fc9yyCyhKHzF3EtnmOaYdfuT2u+XuJaZWj6gun+Gr63cq/4IPDiu/jVXToEQBbLstiPnpbH5tzAGV3CFHNbrjk7XlkQGVvKKFZexCOzkdc+STuqR/jUWhnyKiheu/rHXwN8aMXUOx4ha688DFwI9EPtNOr/pQImzcQ97xsqMJ7EZMvK5Dm2CKoLI0eP6R3BRGT9wmOWdYPCagd+O1nSVl9XtavkH45cLjT9U6TxhMCViIufdx4Bbb74FFohxBtgWj9EoGH/hdny5cQvJYihJgjhJgj7n6ZQHEZ4W5rDYk48C5VUcfoKktF339hDNxXEbM9dyKueRohYi2CyhJZ/j5OaFwNc/lIW+XqT4zipHb4IVr+fML15PiAzVqrQom1fgQvWasgoPLY5AHdTBFNTcYAxl/0GT7pSvoIQXgLN7OnGThzghTJ+4RbzSfc+i1D+hoKJkS6X663lhO04zVE8x8iJH6EoLJEmmNLfLvPKEBpjq1xwHZfxOVPEFYvfSjA8EKJ9cNV3z2A0Uob0rXDr5FyOXAYL3IdgvAWMrOnyXHZiK5Vja6tEK5cfCQwYxlsqyBo+28Rjs0fhRjd4m5oq1O2DfHtPuMCKiqPj/ux0DigduDVRn95n98H8x4eMP5PiGZPIpqaGNaBUU1uiHtfRVw2C9H2V8Tvf4c7mmz0A+1TDndvrpwrGl7WeCwet73GqnAEUFBZElrv9ACAzVoLtcRK72v/JsovD8fHm9iNzn075g1n6eMGwNjznrhFbxg+KnR5B8HNlPj976BrK4Lrl6cV8FbveU7s/iPihucQglY9FKBr/l6jc+F4gIfVEiuCfM0M89Z9F8+R6wh0M0cZto/WvBjUwQdxWjIL0dSEkMQduPmvRNz6AoK7Ka5ZNgSGbSBHvh39wNibwc2eVjLcthF3aDkXC09NCWJPbQ6RexYibn/RaPudsm1IuOg7LqCxKoxM/BiVw1bIr2saBXijuj5ItWedAdAhaj1Cxs4JAUWzJ7nRUTfc4GtadJ21fLp7gQFRXDEbp2Nv4lawn8ROf9K9Nt1d/H4FryLO1bApEL3vvSmrxHzFfmSbf4oQtd54FWbfrcL07mDizhyaEPDLz8J6hn9eexdQHSpmiKYmBkDHZU8gpG0fHzDpIxS7XucLrYb+xrP0lCZzrehT7miy8V73POL7w3hB1eLdBnr/Cd2l6gnxphqQwW5yfG0RVz+FEG0xIWDqBR/ERY8hbnneKGByswf+0ndRS6y+4MvflowA/pNaYtXmI5nPqWpHfCRvIi5+bGJAl3f4/FIDDHbTlhlChrgGr7U/4eS+hTgv/z4ekRZj73JBu8Z0Ltlh/Sg80dSEmiSvKQW83XeBqgQ54tJZCIGrJgZ8f/aox93O7Dc8HuRrRpLV+1wJP9n81f3AOWqJ1e1gv1XDw3fp8BAcFzBgJTFuFvxtoAMGu9F3abhaGEOGuMaAEFMxejda4b6U5tMBYzoX8vHrYwA7y9KnBK4sxolLpanDiD0tVATvQ9w4dxTivYARn24ZA+iQuWsUoFpiBRWtytGAZS3BOcd3EB61mWilzXAZTwTovBCV+/a7jb3aga6jiqvqaNxXzxm1jBmJbMt/01eWPHpo+e1GtmrOKLzCcHuGtOceCe7OQAeXSlLwWv9TQi3fGEa8eombDVlEWv0eceNcxMOvI8RsGAWokC9Dtn0eQozFGMD0rmD8dv5m+MfczVphNGBSMSEB5qSc90YhX/Z/1d1pUFRXFsDxVKVqPk2VJmOMiaMVE81SJlEhcYnGcQlEFkFE4oKIAu4YFUEEQ6O+x94ICrQSFg0qMCoii7agcUMFBQEVFII0S7O2gmgkMQr850NrE+xmE83MUHW+QNOv74/z3r3v3Psu7Jr/KV7GXZzCzwM21dBWU6i+/i0YToDtByTe3K4FqCo43+F3IldO0Mo+5ZVjfc68O4UZHd7zRurTzG+oIFkyS50c2/6FaDccn0N2JFdHcLR4B+GBplq9sAbw2azc8ewHKOoMtADDpSaEb59JoMUQWhLO42v6Vs8B75bTprymAdR1L/w8YFNJNrsd9P5SwBZVKYc2GuI3bwjeYbMQDtsjWgwk8vRGwrZOI2DJcJLLZAQs+xghcVk7YG0Uh3O81IBFyug/371pABNWm3JopRH1kQcg8VKvABWpIRxxNyEncmOPASNWjNPCy4j+gWZlYZ/wHihyiXc30wnYdDsH0agfMQeXc1ARwk+Xt7S/boMeezPUZazkMhmC93QNYIoyHG+TN9VbCBQpl2oDKu+4qKJjW+oi90NW0RGOZj7pEjBuEbKA2TyqKYamGhoKznIswIHQhR/iZz6w14ARqyfxc5SEqmx5n7NPVXC+A548aAX3Sq7QXFnAQY/Z7PaboSnmHi0OVp+uwSYIcYvYe8OvU0Af0wFwpfgc95vf1QaEv5Ge+zPpubcpqf6OpMxHXQLKHRGCTajOTaO1UQn3qmjIT+dajAeBc/7ZK0CZgz4FZw7y4G41zVVFfQbMiPbomH3HfoQmdZVGNOpHzKEV7eO64mBEy7c1bdp7w4+Uit2ECdM1Y0YxwYHdgoF63wVF7YLn66e6J5WSMuu6BZQ7Ii5+n+rcNFoq8mgpPNmra2C8uxk+MwcgGvVjn6spD1WVfcajqYbDW77T4G2fO4ziU/t7Bfh8JyL+MJFd8z+FpMz7wPCeAub5mr7VYQ1gV4h1Z/bSUniS33JTkK0co9UDd9YLx7ubEWLzCSE2n5DsY9tnvObKAuLdZmoAC45HaH7WHaBP+jpiCvw5nCOqAZOWIxxdRrDnt5B46TEnc+Wot2/pAWCFaoWv2cAWcfNX3QIKckdkUnOSJbPYu2o8iYXa2RcRZsnFiPX8fvs6lFa0x93ql5J1muzznNPh9O0KMFkRRpi3IcIOU032xRxajt/MgeR4uSMu/oAjnjao9sQ9olK1jk72nelsYn3wtQDhkbdkco8AhdhFCNIZiBv0dAJK7UZQf3oPbXUKUFTANYU6SspBqT2/0VfAYOuPyEuLobE0t1PAo0VB6tKb+3gNYHigKdJZg2lJOE+eryeqqNjHZP9yoBOjLgFfJzmrKsjTUJ3KPUGUOyIEGnUJ2FqZD6pKKKuEgjJ1VL08wNQAe3zNByKz1+NhYx08qIemGloblVRly/EyeYP9yWvaAY36IVq+TViWhIM3A4n0n8l1f6GN9NxCyusDKa+f293WUZ0v7Ui7Ks/c6tQmbp7wUgDLUnbw+MYJneWslxmpAQ4Ezx/OT+unab7XWHwZ0agf/guH/amyEoSX8RsEWX/E3jxvwqUmhFiNgNQrd4D3u0LrGSC8myk43xE3ftkxC5O76JkDjTiUtZXU59YISu3Uj8DWnY6mtTRL57Tkq4z662cQjfvjv/TjDoDBlsNojpOzL8aOqABz8nw9n3Ay95iuzuJFAF+rO3485fAqY811QpA7Ijp8qLnw6gJ8flbuUOZWfPwNES0HcSF0tXq4U3wOGiq6bPTdWxe5HOfbe7CGavV1VlEBqiryk8KQrR6LT4gZ+25KtQBJvESF7EdUUbFPyCmJ6ayzeCFAfql2qovc13pIYo2QslINaDEQ0XWsbsADNogWHe9E9ic97WSCTQhdPpqr0a60FJ6kVXGlS8Syi4ns22DQe8DKSnUHVVBG/uEQZHajEDeNw+9npw5nhQYw5fLvlNbKKK21fpGt8rp+wb2HQ8gqupjj5Y54cAnCcUdiVk0jwdNGPSGua1xo8x4yLwOSbod0BJQ7IkomEerwGXJ/G+pO7+HJ7Uy4W64T4r4il6xYb+qvn+G3qlv8VnULVcF58o50U2ytraKtopyGnAxky/URLQbis3MmMTcDdAMez26gD7u6df+i0tq5JGf9HmI1AvHgEk78YE+26Ia4Qb/TORNx7mASrnprAWpCNgvRuD9lKTt40s0M3b83myOdMwTpnCHEuhp3m4FtjVVU55xANO6PEGKGIHfE3/sbrY4t8YaUXfNHwvHsW8Drrw5QjehO4qUnIVYjSHNZRK6PRF2tibPViSjavEfYlimkVIbrBpQ7ItqPQDTujyJ5B49unYXGKmjq28D6cb2Cqqd4ou37mmPpAty/c4F6S7z03KMvitdzQPg7pbXuJGc9Vu6OgvM3yuqOy/P9zQYhunyhc6wouo5FavchO6XGmtqaroKE6KxPqPUI0nwWkr5jNU0l2b2Ge1CWz8mQtciWfI7opIew3ajDcToFlOfcB0b+FYDPMtGRkuoNqJqm0/RwTI6fpCnA7B2EQCNtnAM26rV6uyy6HjvGL0Z01sfVYChWEw3Yv2UZp0LXcfVwULdw+UdDOBW6jiTvRWo4r2kIcdrZ7uM+gejIBboA7wLv/nWAz4eidkGO1FMRuPTzNmGHKcKfH8IJt+zR4HvbPhtcVhpiOsEWvdHf4zJjJPvdzAi1Hcm5qM2c3uXM2YhNnI1w41SYE2mhLpwM28CpcGfC1k5A8Jqqjjhb3cdIXUWQ2xTOCd8TFTmflMrdpNZEPgMs5eli8f8OoDoG5e/0ueVt8g9EpzHtp7BkEsIx3U81/Tkc55mgpxfI6FHrcJnxCVU5cvY7GxLrbk7Lkz/Y52pCWf45KgszWT99OGNGr8Vx2sjuM/vZ51g3mhv+Ik0xifiavoW38Rv8FOfAgZ3WIM+51Nf2vwzA1yivn3fNf9tDH9MBbWKcLULqKrzmD0VcO6pjVnYBaDTOUlORbq0rpuRIAPtcTTSA5dcvss3oTdZPH86qqZ8hhM3qfOXEsz/csVV4r9ejIMC7jaTMP0jKfHzMaV6Lj+kA8n23tJJ2NeF/AxBeo+nhZxRX+Wb7efx6QbK2rXJXBBckazniOBPR5UtEyUSEBIeODfUzwN5kFptt7EgOXKkBvHfrIimeswmx/ZSMWH/OxoistnJi0pf+LPh6NpP07Vg9dSSCbJY2nu83iNZD1dm3dhQ3ArwgPfc2MAh4h9pGQ4qrnCitncNL2Pn85QE+i9LaKRQpbSlSbqFIGa1KS7+aIVnDdouhiC5fIEomtYflIKwnzyFeYsXt7JPtGViZR2lSEG6Gw4j13YTzXDu+HuuDvn44BuM38+1YK1ZPHdl+i3nYvv09rYeqAY8sJUGyEFVUHOSV7nzp7XxlgM/H/ebBFCl9cqRbsjMka37N8FjTlrjGHNGoH/ZTZmA5yZ54iRWNNQrORXtw7/op7lyI54DbYiwmLsNi4jIWTrZk8ljvp4DuGI13wPwrOzZZfI64ZTLBnoac93Akw2NN2wkXmzav2YPY7mmAKjruMZeLY7nf/Pb/L2DH6E91wyISL/0asXAM08dJMPlqHfESK5597XUyYO30L9DXD0dPL4hRo9bz/bSPmTHBGYPx7uxZ/w1xHpaIRv345XQsNNVQd+00RUFSqG7w5UHzSM0/KVDecXvVbfoP9YeNotkr2aAAAAAASUVORK5CYII=';
//*
const ArgumentType = require('../../extension-support/argument-type');
const BlockType = require('../../extension-support/block-type');
const formatMessage = require('format-message');
class Scratch3Blocks {
//*/
/*
var ext = class {
*/
	constructor(runtime) {
		this.runtime = runtime;
		this.initialized = false;
		this.port = [21,22,128];
		this.size = [128,64];
		this.rowNum = 8;
	}

	getInfo() {
		this._locale = 0;
		switch(formatMessage.setup().locale) {
		  case 'ja':
		  case 'ja-Hira':
			this._locale = 1;
			break;
		}

		return {
			id: extName,
			name: extName,
			menuIconURI: IconURI,

			blocks: [
				{blockType: BlockType.COMMAND, opcode: 'initLCD', text: 'init [ARG1] I2C=[ARG2] brightness[ARG3]', arguments: {
					ARG1: { type: ArgumentType.STRING, defaultValue:'SSD1306', menu: 'lcdType' },
					ARG2: { type: ArgumentType.STRING, defaultValue:'21_22_128', menu: 'i2cPort' },
					ARG3: { type: ArgumentType.NUMBER, defaultValue:127 },
				}},

				{blockType: BlockType.COMMAND, opcode: 'initLCD2', text: 'init [ARG1] I2C=[ARG2][ARG3] brightness[ARG4]', arguments: {
					ARG1: { type: ArgumentType.STRING, defaultValue:'SSD1306', menu: 'lcdType' },
					ARG2: { type: ArgumentType.NUMBER, defaultValue:0 },
					ARG3: { type: ArgumentType.NUMBER, defaultValue:0 },
					ARG4: { type: ArgumentType.NUMBER, defaultValue:127 },
				}},

				{blockType: BlockType.COMMAND, opcode: 'fillScreen', text: 'fill screen with [ARG1]', arguments: {
					ARG1: { type: ArgumentType.STRING, defaultValue:'0x0000', menu: 'color' },
				}},

				{blockType: BlockType.COMMAND, opcode: 'drawStage', text: 'draw stage=([ARG1],[ARG2]) - ([ARG3],[ARG4]) rotate=[ARG5] [ARG6]', arguments: {
				    ARG1: { type: ArgumentType.NUMBER, defaultValue:-240 },
				    ARG2: { type: ArgumentType.NUMBER, defaultValue:-180 },
				    ARG3: { type: ArgumentType.NUMBER, defaultValue:240 },
				    ARG4: { type: ArgumentType.NUMBER, defaultValue:180 },
				    ARG5: { type: ArgumentType.NUMBER, defaultValue:0 },
					ARG6: { type: ArgumentType.STRING, defaultValue:'errorDiffusion', menu: 'conv' },
				}},
/*
				{blockType: BlockType.COMMAND, opcode: 'sendCmd', text: 'sendCmd [ARG1]', arguments: {
					ARG1: { type: ArgumentType.STRING, defaultValue:'FFFF' },
				}},

				{blockType: BlockType.COMMAND, opcode: 'sendData', text: 'sendData [ARG1]', arguments: {
					ARG1: { type: ArgumentType.STRING, defaultValue:'FFFF' },
				}},
*/
			],

			menus: {
				i2cPort: { acceptReporters: true, items: [
					{ text: 'dA4 cA5 uno', value: '18_19_32', },
					{ text: 'd20 c19 microbit', value: '20_19_63', },
					{ text: 'd0 c1 microbit', value: '0_1_63', },
					{ text: 'd21 c22 ESP32 default', value: '21_22_128', },
					{ text: 'd8 c9 ESP32S3 default', value: '8_9_128', },
					{ text: 'd32 c33 M5StickC', value: '32_33_128', },
					{ text: 'd26 c32 M5Atom', value: '26_32_128', },
					{ text: 'd4 c13 M5Camera', value: '4_13_128', },
					{ text: 'd0 c26 M5StickC Hat', value: '0_26_128', },
					{ text: 'd26 c27 QuadCrawlerAI', value: '26_27_128', },
					{ text: 'd4 c5 RPi pico', value: '4_5_128', },
				]},
				lcdType: { acceptReporters: true, items: [
					{ text: 'SSD1306', value: 'SSD1306', },
					{ text: 'SSD1306_32', value: 'SSD1306_32', },
					{ text: 'SSD1306_6432', value: 'SSD1306_6432', },
					{ text: 'SSD1306_7240', value: 'SSD1306_7240', },
					{ text: 'SSD1315', value: 'SSD1315', },
				]},
				color: { acceptReporters: true, items: [
					{ text: 'BLACK', value: '0x0000' },
					{ text: 'NAVY', value: '0x000F' },
					{ text: 'DARKGREEN', value: '0x03E0' },
					{ text: 'DARKCYAN', value: '0x03EF' },
					{ text: 'MAROON', value: '0x7800' },
					{ text: 'PURPLE', value: '0x780F' },
					{ text: 'OLIVE', value: '0x7BE0' },
					{ text: 'LIGHTGREY', value: '0xD69A' },
					{ text: 'DARKGREY', value: '0x7BEF' },
					{ text: 'BLUE', value: '0x001F' },
					{ text: 'GREEN', value: '0x07E0' },
					{ text: 'CYAN', value: '0x07FF' },
					{ text: 'RED', value: '0xF800' },
					{ text: 'MAGENTA', value: '0xF81F' },
					{ text: 'YELLOW', value: '0xFFE0' },
					{ text: 'WHITE', value: '0xFFFF' },
					{ text: 'ORANGE', value: '0xFDA0' },
					{ text: 'GREENYELLOW', value: '0xB7E0' },
					{ text: 'PINK', value: '0xFE19' },
					{ text: 'TRANSPARENT', value: '0x0120' },
				]},
				onoff: { acceptReporters: true, items: [
					{ text: 'On', value: '1' },
					{ text: 'Off', value: '0' },
				]},
				conv: { acceptReporters: true, items: [
					{ text: ['Error Diffusion', '誤差拡散'][this._locale], value: 'errorDiffusion' },
					{ text: ['Image Thresholding', '二値化'][this._locale], value: 'imageThresholding' },
					{ text: ['Image Thresholding Inv', '二値化(反転)'][this._locale], value: 'imageThresholdingInv' },
				]},
			},
		};
	}

	initLCD(args, util, blockInfo) {
		this.port = args.ARG2.split('_');
		return this.initLCD_SSD1306(args.ARG1, Number(args.ARG3));
	}

	initLCD2(args, util, blockInfo) {
		this.port = [Number(args.ARG2), Number(args.ARG3), 128];
		return this.initLCD_SSD1306(args.ARG1, Number(args.ARG4));
	}

	initLCD_SSD1306(type, brightness) {

		if(type=='SSD1306_32') {
			this.size = [128, 32];
			this.rowNum = 4;
		} else if(type=='SSD1306_6432') {
			this.size = [128, 32];
			this.rowNum = 4;
		} else if(type=='SSD1306_7240') {
			this.size = [128, 40];
			this.rowNum = 5;
		} else {
			this.size = [128, 64];
			this.rowNum = 8;
		}

		this.runtime.renderer.setDevSize(this.size[0],this.size[1]);

		const list0 = [
		//	PREFIX_CMD,

			CMD_DISP_OFF,
			CMD_SETCLKDIV,			0x80,
			CMD_SETMULTIPLEX,		0x3F,
			CMD_SETOFFSET,			0x00,
			CMD_SETSTARTLINE,
			CMD_MEMORYMODE,			0x01,	// vertical
			CMD_SEGREMAP,
			CMD_COMSCANINC,
			CMD_SETVCOMDETECT,		0x10,
			CMD_DISPLAYALLON_RESUME,
			CMD_DEACTIVATE_SCROLL,
			CMD_CHARGEPUMP,			0x14,
			CMD_DISP_ON ,
			CMD_SETCONTRAST,		0x00,
			CMD_SETPRECHARGE,		0x11,
			CMD_SETCOMPINS,			((type=='SSD1306_32')?0x02:0x12),	// 12-128x64, 02-128x32
			CMD_NORMALDISPLAY,

			CMD_SETPRECHARGE,		((brightness+15)/17)*0x11,
			CMD_SETVCOMDETECT,		(brightness>>1),
			CMD_SETCONTRAST,		brightness,
		];

		const _this = this;
		return this.runtime.dev.comlib.wire_begin(this.port[0], this.port[1])
//		.then(() => _this.runtime.dev.comlib.wire_write(ADRS_SSD1306, new Uint8Array(list0)))
		.then(() => _this.writeWireData(PREFIX_CMD, new Uint8Array(list0)))
		.then(() => {
			_this.initialized = true;
		});
	}

	fillScreen(args) {
		if(!this.initialized) return;

		this.runtime.renderer.setDevSize(this.size[0],this.size[1]);

		const byteData = (Number(args.ARG1)==TFT_WHITE) ? 0xFF: 0x00;
		const buf = new Uint8Array(this.size[0] * this.rowNum);	// 1024byte @ 128x64
		buf.fill(byteData);

		const cmd = new Uint8Array([
			PREFIX_CMD,
			CMD_COLUMNADDR, 0x00, this.size[0]-1,
			CMD_PAGEADDR, 0x00, this.rowNum-1,
		]);

		const _this = this;
		return this.runtime.dev.comlib.wire_write(ADRS_SSD1306, cmd)
		.then(() => _this.writeWireData(PREFIX_DATA, buf));
	}

	drawStage(args,util) {
		if(!this.initialized) return;
		
		const tmpData = this.runtime.renderer.drawWithMask(util.sequencer.runtime.ioDevices.video._skinId,
								[Number(args.ARG1),Number(args.ARG3)], 
								[Number(args.ARG2),Number(args.ARG4)], 
								Number(args.ARG5),
								'ImageData');
		if(typeof tmpData === 'undefined') return;

		const size = (tmpData.width * tmpData.height)>>3;	// 1024byte @ 128x64
		let curBuf = new Uint8Array(size);

		switch(args.ARG6) {
		case 'errorDiffusion':
			const grayArray = this.toGrayscale(tmpData.data, tmpData.width, tmpData.height);
			const funcOutput = this.errorDiffusion1CH(grayArray, tmpData.width, tmpData.height);
			for(let x=0; x<tmpData.width; x++) {
				for(let y=0; y<tmpData.height; y++) {
					if(funcOutput[x + y*tmpData.width]) {
						const ofs2 = (x*tmpData.height + y);
						curBuf[ofs2>>3] = curBuf[ofs2>>3] | (1<<(ofs2&7));
					}
				}
			}
			break;

		case 'imageThresholding':
		case 'imageThresholdingInv':
			for(let x=0; x<tmpData.width; x++) {
				for(let y=0; y<tmpData.height; y++) {
					const ofs1 = (x+y*tmpData.width)*4;
					const pixel = (tmpData.data[ofs1+0]+tmpData.data[ofs1+1]+tmpData.data[ofs1+2])/3;
					if((args.ARG6=='imageThresholding'    && pixel >= 0x80)
					|| (args.ARG6=='imageThresholdingInv' && pixel <= 0x80)) {
						const ofs2 = (x*tmpData.height+y);
						curBuf[ofs2>>3] = curBuf[ofs2>>3] | (1<<(ofs2&7));
					}
				}
			}
			break;
		default:
			return;
		}

		console.log("size="+curBuf.length);

		const cmd = new Uint8Array([
			PREFIX_CMD,
			CMD_COLUMNADDR, tmpData.x1, tmpData.x2,
			CMD_PAGEADDR, tmpData.y1>>3, tmpData.y2>>3,
		]);

		const _this = this;
		return this.runtime.dev.comlib.wire_write(ADRS_SSD1306, cmd)
		.then(() => _this.writeWireData(PREFIX_DATA, curBuf));
	}

	writeWireData(cd, buf) {
		const data = new Uint8Array(this.port[2]);
		data[0] = cd;

		const _this = this;
		let i = 0;
		return new Promise(resolve => {
		//	for(i=0; i<size; i+=this.port[2]-1)
			loop();
			function loop(){
				let num = Math.min(_this.port[2]-1, buf.length - i);
				data.set(buf.slice(i,i+num), 1);
				return _this.runtime.dev.comlib.wire_write(ADRS_SSD1306, data.slice(0,num+1))
				.then(() => {
					i += num;
					if(i >= buf.length) {
						resolve();
						return;
					}
					loop();
				})
			}
		});
	}

	sendCmd(args) {
		if(args.ARG1.length & 1) args.ARG1 = '0'+args.ARG1;
		let size = args.ARG1.length/2;
		let buf = new Uint8Array(size+1);
		buf[0] = PREFIX_CMD;
		for(let i = 0; i < size; i++)
			buf[1+i] = parseInt(args.ARG1.slice(i*2,i*2+2),16);

		return this.runtime.dev.comlib.wire_write(ADRS_SSD1306, buf);
	}

	sendData(args) {
		if(args.ARG1.length & 1) args.ARG1 = '0'+args.ARG1;
		let size = args.ARG1.length/2;
		let buf = new Uint8Array(size+1);
		buf[0] = PREFIX_DATA;
		for(let i = 0; i < size; i++)
			buf[1+i] = parseInt(args.ARG1.slice(i*2,i*2+2),16);

		return this.runtime.dev.comlib.wire_write(ADRS_SSD1306, buf);
	}

	// 誤差拡散 ltzz氏 https://qiita.com/ltzz/items/2160b5a73c206e14bde3

	toGrayscale(array, width, height) {
		let outputArray = new Uint8Array(width * height);
		for (let i = 0; i < height; i += 4) {
			for (let j = 0; j < width; j += 4) {
				for (let dy = 0; dy < 4; ++dy) {
					for (let dx = 0; dx < 4; ++dx) {
						const r = array[((i + dy) * width + (j + dx)) * 4 + 0];
						const g = array[((i + dy) * width + (j + dx)) * 4 + 1];
						const b = array[((i + dy) * width + (j + dx)) * 4 + 2];
						const gray = (r + g + b) / 3 | 0;
						outputArray[(i + dy) * width + (j + dx)] = gray;
					}
				}
			}
		}
		return outputArray;
	}

	errorDiffusion1CH(u8array, width, height) {
		let errorDiffusionBuffer = new Int16Array(width * height); // 誤差拡散法で元画像+処理誤差を一旦保持するバッファ Uint8だとオーバーフローする
		let outputData = new Uint8Array(width * height);
		for (let i = 0; i < width * height; ++i) errorDiffusionBuffer[i] = u8array[i];

		for (let i = 0; i < height; i += 1) {
			for (let j = 0; j < width; j += 1) {
				let outputValue;
				let errorValue;
				const currentPositionValue = errorDiffusionBuffer[i * width + j];
				if (currentPositionValue >= 128) {
					outputValue = 255;
					errorValue = currentPositionValue - 255;
				} else {
					outputValue = 0;
					errorValue = currentPositionValue;
				}

				if (j < width - 1) {
					errorDiffusionBuffer[i * width + j + 1] += 5 * errorValue / 16 | 0;
				}
				if (0 < j && i < height - 1) {
					errorDiffusionBuffer[(i + 1) * width + j - 1] += 3 * errorValue / 16 | 0;
				}
				if (i < height - 1) {
					errorDiffusionBuffer[(i + 1) * width + j] += 5 * errorValue / 16 | 0;
				}
				if (j < width - 1 && i < height - 1) {
					errorDiffusionBuffer[(i + 1) * width + j + 1] += 3 * errorValue / 16 | 0;
				}
				outputData[i * width + j] = outputValue;
			}
		}
		return outputData;
	}

}
//*
module.exports = Scratch3Blocks;
//*/

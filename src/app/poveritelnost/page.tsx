import type { Metadata } from "next";
import { Band } from "@/components/Band";
import { AnalyticsSwitch, ClearDeviceData } from "@/components/PrivacyControls";
import { sharedOpenGraph } from "@/lib/site";

const description =
  "Какви данни събира Кулинарният блог на Иво, защо, колко дълго се пазят и какво можете да поискате. Посетителите не получават бисквитки.";

export const metadata: Metadata = {
  title: "Политика за поверителност",
  description,
  alternates: { canonical: "/poveritelnost" },
  openGraph: {
    ...sharedOpenGraph,
    type: "website",
    url: "/poveritelnost",
    title: "Политика за поверителност",
    description,
  },
};

// Every statement here describes what the code does; change them together.
// The research behind it is in COOKIES-PRIVACY-RESEARCH.md.
const CONTACT = "ipenev91@gmail.com";
const UPDATED = "4 ноември 2026";

const h2 = "mt-12 text-section font-bold";
const h3 = "mt-6 text-heading font-bold";
const p = "mt-3 max-w-[65ch] text-body leading-relaxed";
const list = "mt-3 max-w-[65ch] list-disc space-y-2 pl-6 text-body leading-relaxed";

const storage = [
  ["Тема", "светла или тъмна, след като я смените"],
  ["Отметнати продукти и изпълнени стъпки", "докато готвите по рецепта"],
  ["Порции и стъпка в режим „Готви“", "за да продължите оттам, откъдето сте спрели"],
  ["Последно готвена рецепта", "за бутона „Продължете“ на началната страница, който се показва до 7 дни"],
  ["Вашата оценка и харесване", "за да виждате какво сте дали на рецептата"],
  ["Изборът за статистиката", "ако изключите броенето на посещенията по-долу"],
];

export default function PrivacyPage() {
  return (
    <>
      <Band tone="peach" innerClassName="pb-12 pt-12 sm:pb-16 sm:pt-16">
        <h1 className="animate-rise max-w-3xl text-display font-bold">Политика за поверителност</h1>
        <p className="mt-4 max-w-2xl text-body text-muted-foreground">
          Тук обяснявам какви данни събира блогът, защо и какво можете да поискате. Накратко:
          посетителите не получават бисквитки, а имейл и име пазя само ако сами ги въведете.
        </p>
        <p className="mt-3 text-small text-muted-foreground">Последна промяна: {UPDATED}</p>
      </Band>

      <div className="mx-auto max-w-6xl px-4 pb-16 sm:px-6">
        <section aria-labelledby="who">
          <h2 id="who" className={h2}>Кой отговаря за данните</h2>
          <p className={p}>
            Администратор на личните данни е Ивайло Пенев (Иво), физическо лице в България, автор
            на блога. За всеки въпрос или искане пишете на{" "}
            <a href={`mailto:${CONTACT}`} className="font-semibold text-link underline">
              {CONTACT}
            </a>
            .
          </p>
        </section>

        <section aria-labelledby="what">
          <h2 id="what" className={h2}>Какво събира сайтът и защо</h2>

          <h3 className={h3}>Коментари</h3>
          <p className={p}>
            Името и текстът, които въведете, се публикуват под рецептата с датата. Може да
            използвате само малко име или псевдоним. За защита от спам (до 3 коментара за 2
            минути) сървърът пази и хеширан отпечатък на IP адреса ви, не самия адрес. Основание:
            законен интерес да поддържам коментарите полезни и без спам (чл. 6, пар. 1, буква „е“
            от ОРЗД). Коментарът и отпечатъкът се пазят, докато коментарът е публикуван. Ще го
            изтрия, ако ме помолите.
          </p>

          <h3 className={h3}>Оценки със звезди</h3>
          <p className={p}>
            Пази се оценката и хеширан отпечатък на IP адреса, за да има по един глас от посетител
            за рецепта. Основание: законен интерес оценките да са честни (чл. 6, пар. 1, буква
            „е“). Пазят се, докато рецептата е в блога. Без вашия IP адрес оценката не може да се
            свърже с вас.
          </p>

          <h3 className={h3}>Харесвания</h3>
          <p className={p}>
            Харесването увеличава само брояча на рецептата и не се свързва с вас. Като при всяка
            заявка, базата данни вижда IP адреса на браузъра ви, но не го пази с харесването.
          </p>

          <h3 className={h3}>Бюлетин</h3>
          <p className={p}>
            Ако запишете имейла си, ще ви пиша, когато добавя нова рецепта. Писмата изпращам лично
            от пощата си в Gmail, като всички адреси са в „Скрито копие“ (Bcc), така че
            абонатите не виждат адресите си. Основание: вашето съгласие (чл. 6, пар. 1, буква „а“
            от ОРЗД), което давате, като запишете имейла си. Можете да го оттеглите по всяко
            време: пишете ми или отговорете на писмо и ще изтрия адреса. Пазя го, докато не се
            отпишете.
          </p>

          <h3 className={h3}>Хостинг и технически записи</h3>
          <p className={p}>
            Както всеки сайт, сървърът записва за кратко техническа информация за заявките (IP
            адрес, браузър, час), за да работи сайтът и да е защитен от злоупотреби. Основание:
            законен интерес (чл. 6, пар. 1, буква „е“). Записите се пазят според сроковете на
            доставчика на хостинга, Vercel.
          </p>

          <h3 className={h3}>Статистика за посещенията и скоростта</h3>
          <p className={p}>
            Използвам Vercel Web Analytics и Speed Insights, за да знам кои рецепти се четат и
            колко бързо се зарежда сайтът. Те не използват бисквитки. Изпраща се адресът на
            страницата, сайтът, от който идвате, държавата и видът на браузъра и устройството.
            Повторното посещение се разпознава по отпечатък от заявката, който се изтрива след 24
            часа, а аз виждам само обобщени числа. Основание: законен интерес (чл. 6, пар. 1,
            буква „е“). Можете да изключите статистиката за този браузър:
          </p>
          <div className="mt-4">
            <AnalyticsSwitch />
          </div>
        </section>

        <section aria-labelledby="storage">
          <h2 id="storage" className={h2}>Бисквитки и запазване на устройството</h2>
          <p className={p}>
            Блогът не поставя бисквитки на посетителите. Единствената бисквитка е за моя вход в
            администрацията. За удобство при готвене браузърът ви запазва някои неща в паметта си
            (localStorage), само когато използвате съответната функция. Те не напускат
            устройството ви и са необходими за функцията, която сте поискали (чл. 4а, ал. 4 от
            Закона за електронната търговия):
          </p>
          <ul className={list}>
            {storage.map(([what, why]) => (
              <li key={what}>
                <span className="font-semibold">{what}:</span> {why}
              </li>
            ))}
          </ul>
          <div className="mt-5">
            <ClearDeviceData />
          </div>
        </section>

        <section aria-labelledby="recipients">
          <h2 id="recipients" className={h2}>Кой още обработва данните</h2>
          <ul className={list}>
            <li>
              <span className="font-semibold">Vercel Inc.</span> (САЩ): хостинг и статистика.
              Предаването на данни към САЩ се основава на Рамката за защита на данните между ЕС и
              САЩ и на стандартни договорни клаузи.
            </li>
            <li>
              <span className="font-semibold">Supabase</span>: базата данни с коментарите,
              оценките и абонатите, разположена във Франкфурт (Германия, ЕС). Поддръжката им може
              да има достъп от други държави по стандартни договорни клаузи.
            </li>
            <li>
              <span className="font-semibold">Google</span>: пощата, от която изпращам бюлетина.
            </li>
          </ul>
          <p className={p}>Не продавам данни и не ги предоставям за реклама.</p>
        </section>

        <section aria-labelledby="rights">
          <h2 id="rights" className={h2}>Вашите права</h2>
          <p className={p}>
            Можете да поискате достъп до данните си, да ги поправите или изтриете, да ограничите
            обработването им, да възразите срещу обработване на основание законен интерес, да
            получите имейла си от бюлетина в преносим вид и да оттеглите съгласието си. Пишете на{" "}
            <a href={`mailto:${CONTACT}`} className="font-semibold text-link underline">
              {CONTACT}
            </a>
            ; отговарям до един месец.
          </p>
          <p className={p}>
            Имате право и на жалба до Комисията за защита на личните данни (
            <a href="https://www.cpdp.bg" className="font-semibold text-link underline">
              cpdp.bg
            </a>
            ).
          </p>
        </section>

        <section aria-labelledby="changes">
          <h2 id="changes" className={h2}>Промени</h2>
          <p className={p}>
            Ако променя начина, по който сайтът работи с данни, ще обновя тази страница и датата
            в началото ѝ.
          </p>
        </section>
      </div>
    </>
  );
}

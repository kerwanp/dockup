import { AnimatedSpan, Terminal, TypingAnimation } from "./magic/terminal";

export const Install = () => {
  return (
    <Terminal sequence={false}>
      <TypingAnimation>{"> npx dockup"}</TypingAnimation>
      <AnimatedSpan delay={1000} className="text-gray-400">
        <span>│ </span>
        <span className="text-purple-400">
          ◆ What services do you want to configure?
        </span>
        <span>│ PostgreSQL, Redis, MailHog</span>
      </AnimatedSpan>
      {/* <AnimatedSpan delay={1800} className="text-gray-400"> */}
      {/*   <span>│ </span> */}
      {/*   <span className="text-purple-300"> */}
      {/*     ◆ What presets do you want to configure? */}
      {/*   </span> */}
      {/*   <span>│ NextJS, Clerk, Prisma</span> */}
      {/* </AnimatedSpan> */}
      {/* <AnimatedSpan delay={2300} className="text-gray-400"> */}
      {/*   <span>│ </span> */}
      {/*   <span className="text-purple-500">▼ Generating project</span> */}
      {/* </AnimatedSpan> */}
      <AnimatedSpan delay={2000} className="text-gray-400">
        <span>│ </span>
        <span className="text-green-400">✔ 4 services configured</span>
      </AnimatedSpan>
      <TypingAnimation className="mt-4" delay={3000}>
        {"> dockup up"}
      </TypingAnimation>
      <AnimatedSpan delay={4000} className="text-gray-400">
        <span>│ </span>
        <span className="text-green-400">✔ 4 services running</span>
      </AnimatedSpan>
    </Terminal>
  );
};

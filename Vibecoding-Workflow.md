# GitHUb Copilot Workflow

1. write app description as detailed as posible:
    - functions
    - design
    - techstack (ask copilot what is the best for your app, discuss, descide ) -> modify description

2. let llm write implementation plan:
    - store in markdown
    - iterative
    - let the llm check the plan
    - every feature one step!


3. start building every step. 

    WorkFlow: 
    1. Create feature branch or commit last changes
    2. Check description / Plan 
    3. Write or Rewrite Implementation plan
    4. tell the llm not to assume things -> ask before assumption!
    5. Check implementation plan! ask questions, let modify
    6. start implementation
    7. test implementaion / check code

4. be iteratve:
- use feature brancxhes often
- let never generate to much at one time
- instruct clearly, tell for clarification


## Prompt Examples
- write a instruction plan for the following appliation <application_description.md> by following strict the rules:
    - do not make assumptions, just ask for clarification, start writing if everything is clear
    - explain each implementatio phase: what is it for, how does it works, what technology will be used
    - write step by step so that a llm model and a human can follow and implement
    
- after each step, test everything, tell me how to test and what is done and how it works
- looks good. go on with next setp. after each step, test everything, tell me what is done, how to test and how it works
- beschreibe erstmal phase 4 im IMPLEMENTATION_PLAN, so das die feature und der umsetzungsplan klar ist.  





# Links
- https://www.youtube.com/watch?v=0XoXNG65rfg
- https://code.visualstudio.com/docs/copilot/copilot-tips-and-tricks#_choose-the-right-copilot-tool
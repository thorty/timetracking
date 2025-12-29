# GitHub Copilot Workflow

1. Write the app description as detailed as possible:
    - Functions
    - Design
    - Tech stack (ask Copilot for the best options for your app, discuss, decide) -> modify the description

2. Let an LLM write the implementation plan:
    - Store it in Markdown
    - Make it iterative
    - Let the LLM check the plan
    - Implement every feature step by step

    `Use one of the most advanced models for this task (e.g., Claude 4.5).`

3. Building Workflow:

    `Use a smaller model for implementation, faster and more straightforward than others.`

    1. Create a feature branch or commit the last changes
    2. Check the description/plan
    3. Write or rewrite the implementation plan
    4. Instruct the LLM not to make assumptions -> ask before assuming!
    5. Check the implementation plan! Ask questions, let it modify
    6. Start implementation
    7. Test the implementation / check the code

4. Be iterative:
    - Use feature branches often
    - Never generate too much at one time
    - Provide clear instructions, ask for clarification when needed


## Prompt Examples

- Write an instruction plan for the following application <application_description.md> by strictly following these rules:
    - Do not make assumptions, just ask for clarification. Start writing only if everything is clear.
    - Explain each implementation phase: what it is for, how it works, and what technology will be used.
    - Write step by step so that both an LLM model and a human can follow and implement it.

- After each step, test everything. Tell me how to test, what is done, and how it works.
- Looks good. Go on with the next step. After each step, test everything. Tell me what is done, how to test, and how it works.
- First, describe phase 4 in the IMPLEMENTATION_PLAN so that the features and the implementation plan are clear.




# Links
- https://www.youtube.com/watch?v=0XoXNG65rfg
- https://code.visualstudio.com/docs/copilot/copilot-tips-and-tricks#_choose-the-right-copilot-tool
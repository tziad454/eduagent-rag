import { DocumentChunk } from './types';

export const INITIAL_KNOWLEDGE_BASE: DocumentChunk[] = [
  {
    id: 'c1',
    title: 'Vygotsky Theory',
    source: 'Pedagogical Theory Module',
    content: 'Lev Vygotsky developed the concept of the Zone of Proximal Development (ZPD). The ZPD is defined as the distance between what a learner can do without help and what they can do with guidance and encouragement from a skilled partner. It is a core concept in Intelligent Tutoring Systems.'
  },
  {
    id: 'c2',
    title: 'Intelligent Tutoring Systems (ITS)',
    source: 'ITS Overview',
    content: 'Intelligent Tutoring Systems (ITS) are computer systems that aim to provide immediate and personalized instruction or feedback to learners, usually without intervention from a human teacher. Modern ITS often incorporate agentic workflows.'
  },
  {
    id: 'c3',
    title: 'Agentic AI Workflows',
    source: 'AI Architecture Docs',
    content: 'Agentic AI moves beyond simple prompt-response loops. It utilizes frameworks like ReAct, Chain-of-Thought, and Planner-Executor models. Tools such as LangChain or LlamaIndex are highly recommended for managing these workflows.'
  },
  {
    id: 'c4',
    title: 'EduAgent Architecture',
    source: 'Project Proposal',
    content: 'The EduAgent system is designed in incremental phases. Phase 1 involves a simple chatbot with RAG. Phase 3 splits responsibilities between Planner, Tutor, and Tool-Using agents. Phase 4 integrates persistent memory using vector databases like Pinecone or ChromaDB.'
  },
  {
    id: 'c5',
    title: 'Risk Mitigation',
    source: 'Thesis Constraints',
    content: 'Major risks include LLM hallucinations and high latency. Mitigation strategies include strict sandboxing for code execution (e.g., Piston API), sanitizing inputs, and implementing "supervisor" agents to step in when the primary agent fails.'
  },
  {
    id: 'c6',
    title: 'Scaffolding in Education',
    source: 'Pedagogical Theory Module',
    content: 'Instructional scaffolding is the support given during the learning process which is tailored to the needs of the student with the intention of helping the student achieve his/her learning goals. This aligns closely with Vygotskys ZPD.'
  }
];
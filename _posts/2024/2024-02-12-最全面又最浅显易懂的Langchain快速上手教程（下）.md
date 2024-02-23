---
layout:     post
title:      最全面又最浅显易懂的Langchain快速上手教程（下）
header-img: /img/post.png
catalog: true
tags:
- 人工智能
- Agent
- LLM
- Langchain
---

> 文章内容更新请以 [WGrape GitHub博客 : 最全面又最浅显易懂的Langchain快速上手教程（下）](https://github.com/WGrape/Blog/issues/276) 为准

> 本文原创，著作权归[WGrape](https://github.com/WGrape)所有，未经授权，严禁转载

# 最全面又最浅显易懂的Langchain快速上手教程（下）

## 三. 深入Langchain

### 1. 架构设计

从上文知道Langchain在架构上使用了从抽象、到具体、再到整合适配的三层架构，这种一层一层逐渐具体的设计最大可能性的保证了架构的可扩展性和维护性。同时这种设计也说明其实每一层架构其实是类似的，无非是一层一层逐渐把抽象的设计实现出来而已。

所以每一层的内部设计也基本是类似的，因为整体上来说，无论是在抽象层（Core），还是实现层（Community），还是整合层（Langchain），Langchain的核心模块都是由```Model I/O```、```Retrieval```、```Agents```、```Chains```、```Memory```、```Callbacks```六部分组成的。这些核心模块从源码中也是可以看出来的，比如在/[libs](https://github.com/langchain-ai/langchain/tree/master/libs)/[langchain](https://github.com/langchain-ai/langchain/tree/master/libs/langchain)/langchain/和/[libs](https://github.com/langchain-ai/langchain/tree/master/libs)/[core](https://github.com/langchain-ai/langchain/tree/master/libs/core)/langchain_core/中

![image](https://github.com/WGrape/Blog/assets/35942268/ec2376b8-9a43-48dd-9272-78c5ba74786f)

### 2. 核心模块

#### (1) Model I/O

Model指LLM大模型，I/O指输入输出系统。所以Model I/O 顾名思义是指以LLM大模型为核心的输入输出系统，如下图所示

<img width="500" src="https://github.com/WGrape/Blog/assets/35942268/537d5d07-b9c2-4ba2-a170-9e14bf189302">

在源码[langchain](https://github.com/langchain-ai/langchain/tree/master)/[libs](https://github.com/langchain-ai/langchain/tree/master/libs)/[core](https://github.com/langchain-ai/langchain/tree/master/libs/core)/langchain_core/中可以看到，它们都定义在了langchain_core抽象层中，然后在langchain_community中实现，最后由langchain统一整合。

![image](https://github.com/WGrape/Blog/assets/35942268/cf0591d4-0e79-4caf-b454-65754c90395d)

##### ① Chat Models/LLMs (Model)

Model即LLM大语言模型，从源码中可以看出来它主要分为```Chat Models```和```LLMs```两种类型。

![截屏2024-02-22 14 48 23](https://github.com/WGrape/Blog/assets/35942268/e1a5ce75-162c-4cb3-9cef-ac7e4c548407)

看到这里，心里一定会有疑问，Model不就是只有LLM大语言模型这一种吗，怎么还会出现```Chat Models```这种模型呢，它和LLM的关系又是什么呢？

其实这个问题非常容易理解，首先LLM大模型语言就是如GPT模型这种，一般都是生成式的模型，所以应用场景主要用于比如回答问题、聊天对话、生成图片等AIGC的场景。也就是说LLM模型是同时支持回答问题（单轮）和聊天对话（多轮）的，虽然底层都是只使用了这一个LLM模型，但是它确实是提供了这两种不同的聊天能力，只需要向LLM输入不同的内容即可。

所以为了方便使用LLM模型的单轮和多轮的问题回答能力，Langchain提供了这两种不同的Model，与其说是不同的Model，倒不如说是同一个Model(LLM模型)下两种不同的使用方式，而且这两种使用方式都是抽象的接口，以便接入不同的LLM大语言模型供应商（比如OpenAI、Google等）。

![image](https://github.com/WGrape/Blog/assets/35942268/3de2342b-4e1f-45c6-ab77-6fa9d9adc569)

1. LLMs: 主要用于单轮的问题回答处理，输出和输出的数据格式都是```string```即字符串
2. Chat Model: 主要用于多轮的对话处理，输入和输出的数据格式都是```List[BaseMessage]```即消息数组，```BaseMessage```消息主要包括```AIMessage/HumanMessage/SystemMessage```这三种类型

```python
# 创建一个llm类型的model并开始询问
from langchain_openai import OpenAI

llm = OpenAI(openai_api_key="...")
llm.invoke("1 + 1 = ?")

# 创建一个chat model类型的model并开始对话
from langchain_openai import ChatOpenAI

chat = ChatOpenAI(openai_api_key="...")

from langchain_core.messages import HumanMessage, SystemMessage
messages = [
    SystemMessage(content="You're good at math"),
    HumanMessage(content="1 + 1 = ?"),
]

chat.invoke(messages)
```

> 更多接口信息请查看官方[language_models API文档](https://api.python.langchain.com/en/latest/core_api_reference.html#module-langchain_core.language_models)

##### ② Prompts (Input)
在 NLP 领域，Prompt（提示）是一种用于引导预训练语言模型解决特定任务的方法。它通常是一段文本，用于构建问题或任务的描述，以便预训练语言模型可以根据其内在知识生成合适的输出。

![image](https://github.com/WGrape/Blog/assets/35942268/a01d355f-400d-4985-b682-a7fb8634af40)


在Langchain中，Prompt具体是指向大语言模型LLM发起的一组指令或输入，用于引导LLM的响应。它的目标是建立与模型无关的跨语言、跨平台、跨模型的通用性Prompt系统。

根据Model类型的不同，Prompt也主要分为```PromptTemplate```和```ChatPromptTemplate```两种。

1. PromptTemplate ：先使用```from_template()```方法创建一个模板，支持传递任意数量的变量，然后使用```format()```方法格式化即可。
2. ChatPromptTemplate ：显示```from_messages()```方法创建一个消息列表，然后再在消息列表中组装不同类型的```BaseMessage```类型即可。

![截屏2024-02-22 15 48 19](https://github.com/WGrape/Blog/assets/35942268/6b6bca3a-477f-44dd-8a2e-243637869bfe)

```python
from langchain.prompts import PromptTemplate

# ====================== PromptTemplate ======================

# Prompt中有多个变量
prompt_template = PromptTemplate.from_template(
    "Tell me a {adjective} joke about {content}."
)
# 输出: Tell me a funny joke about math.
print(prompt_template.format(adjective="funny", content="math"))

# Prompt中没有任何变量
prompt_template = PromptTemplate.from_template("Tell me a joke")

# 输出: Tell me a joke
prompt = prompt_template.format()
print(prompt)

# 调用llm模型输出: Why couldn't the bicycle stand up by itself? Because it was two-tired.
from langchain_openai import OpenAI
llm = OpenAI()
print(llm.invoke(prompt))

# ====================== ChatPromptTemplate ======================

from langchain_core.prompts import ChatPromptTemplate

# 第1种
chat_template = ChatPromptTemplate.from_messages(
    [
        ("system", "You are good at math. Your name is {name}."),
        ("human", "please help me, my question is: {user_input}"),
    ]
)

# 输出: [SystemMessage(content='You are good at math. Your name is GaoSi.'), HumanMessage(content='please help me, my question is: 1 + 1 = ?')]
messages = chat_template.format_messages(name="GaoSi", user_input="1 + 1 = ?")
print(messages)

# 第2种
from langchain.prompts import HumanMessagePromptTemplate
from langchain_core.messages import SystemMessage
chat_template = ChatPromptTemplate.from_messages(
    [
        SystemMessage(
            content=(
                "You are good at math."
                "Your name is GaoSi."
            )
        ),
        HumanMessagePromptTemplate.from_template("please help me, my question is: {user_input}"),
    ]
)

# 输出: [SystemMessage(content='You are good at math.Your name is GaoSi.'), HumanMessage(content='please help me, my question is: 1 + 1 = ?')]
messages = chat_template.format_messages(user_input="1 + 1 = ?")
print(messages)

# 调用chat模型输出: content='1 + 1 = 2'
from langchain_openai import ChatOpenAI
chat = ChatOpenAI()
print(chat.invoke(messages))
```

##### ③ Output Parsers (Output)
Output Parsers即输出解析器，用于对Model的输出执行二次处理（部分支持流式输出）。关于更多的输出解析器类型和使用方法请[参考文档](https://python.langchain.com/docs/modules/model_io/output_parsers/)


比如最常见的对Model输出做JSON化处理场景，如下所示。

<img width="613" alt="image" src="https://github.com/WGrape/Blog/assets/35942268/6c7fa17a-17c6-43d0-a84d-a067c67ac343">

如果需要流式输出，使用```chain.stream()```即可，需要注意的是使用前需要确认具体的某个```Output Parser```是否支持流式输出功能。

<img width="685" alt="image" src="https://github.com/WGrape/Blog/assets/35942268/1fa8fde4-8c06-4376-a0cc-cf553f8a6763">

```python
# 创建Model
from langchain_openai import ChatOpenAI
model = ChatOpenAI()

# 创建output_parser(输出)
from langchain_core.output_parsers import JsonOutputParser
from langchain_core.pydantic_v1 import BaseModel, Field
class MathProblem(BaseModel):
    question: str = Field(description="the question")
    answer: str = Field(description="the answer of question")
    steps: str = Field(description="the resolve steps of question")

output_parser = JsonOutputParser(pydantic_object=MathProblem)

# 创建prompt(输入)
from langchain.prompts import PromptTemplate
prompt = PromptTemplate(
    template="You are good at math, please answer the user query.\n{format_instructions}\n{query}\n",
    input_variables=["query"],
    partial_variables={"format_instructions": output_parser.get_format_instructions()},
)

# 创建Chain并链式调用
chain = prompt | model | output_parser
print(chain.invoke({"query": "1+1=?"}))

# 使用流式输出
for s in chain.stream({"query": "1+1=?"}):
    print(s)
```

#### (2) Memory

<img width="500" src="https://github.com/WGrape/Blog/assets/35942268/004cd339-c5b4-4116-b437-716a83d43c87">

##### ① 简单的例子 Chat Messages
```ChatMessageHistory```是一个非常轻量的用于存取```HumanMessages/AIMessages```等消息的工具类。

```python
from langchain.memory import ChatMessageHistory

history = ChatMessageHistory()

history.add_user_message("hi!")

history.add_ai_message("whats up?")

# [HumanMessage(content='hi!', additional_kwargs={}), AIMessage(content='whats up?', additional_kwargs={})]
print(history.messages)
```

##### ② 内存的类型
内存分为```Short-term```短期存储和```Long-term```长期存储。

- Conversation Buffer ：无窗口的会话缓冲
- Conversation Buffer Window ：有窗口的会话缓冲
- Conversation Summary ：无窗口的会话摘要（摘要是指对内容的总结压缩，而非全部）
- Conversation Summary Buffer ：有窗口的会话摘要
- Conversation Token Buffer ：基于token长度计算的会话缓冲
- Backed by a Vector Store ：基于向量存储的会话存储

##### ③ 在Chain中使用内存

```python
from langchain.chains import LLMChain
from langchain.memory import ConversationBufferMemory
from langchain.prompts import PromptTemplate
from langchain_openai import OpenAI

template = """You are a chatbot having a conversation with a human.

{chat_history}
Human: {human_input}
Chatbot:"""

prompt = PromptTemplate(
    input_variables=["chat_history", "human_input"], template=template
)
memory = ConversationBufferMemory(memory_key="chat_history")

llm = OpenAI()
llm_chain = LLMChain(
    llm=llm,
    prompt=prompt,
    verbose=True,
    memory=memory,
)
# Hello there! How are you?
print(llm_chain.predict(human_input="Hi, my friend"))
```

##### ④ 在Agent中使用内存

```python
from langchain.agents import AgentExecutor, Tool, ZeroShotAgent
from langchain.chains import LLMChain
from langchain.memory import ConversationBufferMemory
from langchain_community.utilities import GoogleSearchAPIWrapper
from langchain_openai import OpenAI

# 定义Tool
# 需要定义环境变量 export GOOGLE_API_KEY="", 在网站上注册并生成API Key: https://serpapi.com/searches
search = GoogleSearchAPIWrapper()
tools = [
    Tool(
        name="Search",
        func=search.run,
        description="useful for when you need to answer questions about current events",
    )
]

# 定义Prompt
prefix = """Have a conversation with a human, answering the following questions as best you can. You have access to the following tools:"""
suffix = """Begin!"

{chat_history}
Question: {input}
{agent_scratchpad}"""

prompt = ZeroShotAgent.create_prompt(
    tools,
    prefix=prefix,
    suffix=suffix,
    input_variables=["input", "chat_history", "agent_scratchpad"],
)

# 定义Memory
memory = ConversationBufferMemory(memory_key="chat_history")

# 定义LLMChain
llm_chain = LLMChain(llm=OpenAI(temperature=0), prompt=prompt)

# 定义Agent
agent = ZeroShotAgent(llm_chain=llm_chain, tools=tools, verbose=True)
agent_chain = AgentExecutor.from_agent_and_tools(
    agent=agent, tools=tools, verbose=True, memory=memory
)
agent_chain.run(input="How many people live in canada?")
```

##### ⑤ 内存第三方集成
内存的底层实现一般是```Redis/MongoDB/Postgres```等，具体请查看官方的[内存集成大全](https://python.langchain.com/docs/integrations/memory/)

#### (3) Agents

基于LLM我们可以做很多事情，比如让它回答我们的问题，让它对某个话题/知识点做总结，让它出一道相似的题目等等。我们会发现当需要LLM做的事情越来越多的时候，很多时候有些功能是可以复用的。也就是说我们可以把基于LLM实现的一个功能抽象成一个可复用的模块，没错，它就是Agent ！

<img width="500" src="https://github.com/WGrape/Blog/assets/35942268/d5f2b332-1f3c-458c-b4f1-f104d361828f">

Agent的核心思想是基于LLM大语言模型做一系列的操作，并把这一系列操作抽象成一个可复用的功能！明白了这个，就会对后面Agent的理解有很大帮助，让我们把结构精简为下图所示

- Planning ：Agent的规划阶段涉及确定如何利用LLM大语言模型以及其他工具来完成特定任务。这包括确定所需的输入和输出，以及选择适当的工具和策略。
- Memory ：在记忆阶段，Agent需要能够存储和访问过去的信息，以便在当前任务中使用。这包括对过去对话或交互的记忆，以及对相关实体和关系的记忆。
- Tools ：：工具是Agent执行任务所需的具体操作。这可能涉及到执行搜索、执行特定编程语言代码、执行数据处理等操作。这些工具可以是预定义的函数或API如```search()```, ```python_execute()```等
- Action ：在执行阶段，Agent利用选择的工具执行特定的动作，以完成规划阶段确定的任务。这可能包括生成文本、执行计算、操作数据等。动作的执行通常是基于规划阶段的决策和记忆阶段的信息。

![image](https://github.com/WGrape/Blog/assets/35942268/85469b82-d08b-4cfd-bbfc-e3874301e1e1)

##### ① Agent类型

Agent类型按照模型类型、是否支持聊天历史、是否支持函数并行调用等维度的不同，主要分为以下几种不同的Agent，更多可以参考[agent_types文档](https://python.langchain.com/docs/modules/agents/agent_types/) ：

- ```OpenAI functions``` ：基于OpenAI Function的Agent
- ```OpenAI tools``` ：基于OpenAI Tool的Agent
- ```XML Agent``` ：有些LLM模型很适合编写和理解XML（比如Anthropic’s Claude），所以可以使用XML Agent
- ```JSON Chat Agent``` ：有些LLM模型很适合编写和理解JSON，所以可以使用JSON Agent
- ```Structured chat Agent``` ：使用结构化的聊天Agent可以使用多输入的工具
- ```ReAct Agent``` ：基于[ReAct ](https://react-lm.github.io/)逻辑的Agent

##### ② Tools工具

Tools是Agent最核心的部分之一，也是Agent与外界交互的重要接口，让它具备了与世界沟通的能力。工具充当了Agent与外部环境之间的桥梁，使得Agent能够处理来自外部环境的输入，并生成相应的输出。

Tools并不是Langchain自己发明创造的，而是属于通用的Agent概念中的一个重要组成部分，在OpenAI中它就原生支持除了message之外的Tools参数和Functions参数，这两个参数没有太大区别，只是使用Tools逐步代替了早期的Functions参数。

![image](https://github.com/WGrape/Blog/assets/35942268/c4eef8db-ee54-4d38-bfb9-988645870d76)

举例来说，Agent可以使用搜索工具来获取特定主题的信息，使用语言处理工具来理解和生成文本，使用编程执行工具来执行特定的代码等。这些工具允许Agent从外部获取所需的信息，并对外部环境产生影响。在这种情况下它的工作流程如下所示 ：

- ① 用户发起请求，Agent接收请求
- ② Agent会把 ```System Text + User Text + Tools/Functions``` 一起传递给LLM（如调用ChatGPT接口）
- ③ 由于LLM发现传递了Tools/Functions参数，所以首次LLM只返回应该调用的函数（如search_func）
- ④⑤ Agent会自己调用对应的函数（如search_func）并获取到函数的返回结果（如search_result）
- ⑥ Agent把函数的返回结果并入到上下文中，最后再把 ```System Text + User Text + search_result``` 一起传递给LLM
- ⑦ LLM把结果返回给Agent
- ⑧ Agent再把结果返回给用户

<img width="500" alt="image" src="https://github.com/WGrape/Blog/assets/35942268/40cad96d-1ac8-40d2-b030-76fca4e3f720">

在Langchain中，Tools是一个在抽象层定义的类，它具备一些如```name/description/args_schema/func```等之类的基础属性，也支持使用```@tool```自定义Tool工具，更多请参看[源码](https://github.com/langchain-ai/langchain/blob/master/libs/core/langchain_core/tools.py)和[接口文档](https://api.python.langchain.com/en/latest/tools/langchain_core.tools.Tool.html#langchain_core.tools.Tool)，同时框架内部也集成了很多开箱即用的[Tools](https://python.langchain.com/docs/integrations/tools)和[ToolKits工具集](https://python.langchain.com/docs/integrations/toolkits)。

下面可以通过一个简单的例子来看一下，使用```@tool```注解自定义一个Tool工具

```python
from langchain.tools import tool

@tool
def search(query: str) -> str:
    """Look up things online."""
    return "LangChain"

print(search)
```

<img width="800" alt="image" src="https://github.com/WGrape/Blog/assets/35942268/31e55c97-43ad-4881-9df0-c7de4c41a20d">

由于OpenAI接口支持```Functions```和```Tools```两种使用，所以Langchain也支持把Tool转为Function，可以查看如下例子

```python
from langchain_core.utils.function_calling import convert_to_openai_function
tools = [search]
functions = [convert_to_openai_function(t) for t in tools]

from langchain_core.messages import HumanMessage
from langchain_openai import ChatOpenAI
model = ChatOpenAI(model="gpt-3.5-turbo")
message = model.invoke(
    [HumanMessage(content="hello, my friend ! i want to search dog")], functions=functions
)
print(message)
```

<img width="800" alt="image" src="https://github.com/WGrape/Blog/assets/35942268/5003b075-bee7-4589-a1b3-2a7d88cccaa8">

#### (4) Chains

官方对```Chains```的定义是指Prompt、LLM、Tool等一系列的调用组合，也就是说只要定义完各个模块，我们使用Chain就可以自动把各个模块之间连接起来并运行。我们知道在Langchain Lib整个结构中，从底向上依次是抽象层、具体实现层、以及整合适配层，现在有没有发现些什么呢 ？没错！这个整合适配层的核心实现，就是基于```Chains```链！

<img width="500" src="https://github.com/WGrape/Blog/assets/35942268/0eacd9f7-3e12-4e6f-8402-890e5dcd239d">

所以只有在[langchain](https://github.com/langchain-ai/langchain/tree/master)/[libs](https://github.com/langchain-ai/langchain/tree/master/libs)/[langchain](https://github.com/langchain-ai/langchain/tree/master/libs/langchain)/langchain/的源码中才有```chains```这个模块，在```Core/Community```中都是没有的，如下图所示。

![image](https://github.com/WGrape/Blog/assets/35942268/de8e8cf7-39f4-41c5-9faa-5ead3606018a)

从[Chains](https://python.langchain.com/docs/modules/chains)官方文档可知，目前一共分为两种类型的Chain：

- LCEL Chains ：LCEL (LangChain Expression Language) 即Langchain提供的一种更简单的链式操作的表达式语言
- Legacy Chain ：传统的基于类调用的方式实现，是Langchain遗留的Chains操作，底层不是基于LCEL实现，而是基于类调用

#### (5) Retrieval

在《深入浅出LLM大语言模型》文章中，提到了RAG是最常用的LLM应用场景之一。所以Langchain提供了完整的RAG接入方式，称为```Retrieval```检索模块。如果对RAG检索不是很理解，强烈建议先阅读《深入浅出LLM大语言模型》文章，有助于对本```Retrieval```模块的理解。

<img width="750" alt="image" src="https://github.com/WGrape/Blog/assets/35942268/cc75d1a1-d0cb-43a0-ab33-71bbe98c0e1e">

一个完整的检索模块按照流程，主要包括以下部分

- Document Loader ：文档加载器，用于加载如PDF、Word、Web等任何形式的数据源，参考[文件加载器大全](https://python.langchain.com/docs/integrations/document_loaders/)
- Text Splitters ：文本切割器，对加载的文档进行分词切割处理，得到一个一个的最小单元token。比如按照HTML标签、字符切割。参考[document_transformers大全](https://python.langchain.com/docs/integrations/document_transformers)
- Text embedding models ：文本嵌入模型，即对token做向量化处理，比如对token进行ID编码，然后再转换成向量。参考[文本嵌入模型大全](https://python.langchain.com/docs/integrations/text_embedding/)
- Vector stores ：向量存储，即把上面得到的向量数据依次存储下来，常见向量存储系统有weaviate等，参考[向量存储大全](https://python.langchain.com/docs/integrations/vectorstores/)
- Retrievers ：检索器，基于不同的检索算法对向量数据库中的数据进行检索，参考[检索器大全文档](https://python.langchain.com/docs/modules/data_connection/retrievers/)

<img width="750" alt="image" src="https://github.com/WGrape/Blog/assets/35942268/4574b43d-3fa2-422a-a230-1a78ebe8a084">


更多不同组件具体的使用方式，这里没有必要再讲解，具体参考[使用文档](https://python.langchain.com/docs/modules/data_connection/)即可。

```python
from langchain_community.document_loaders import TextLoader

# 加载markdown文档
loader = TextLoader("./index.md")
loader.load()
```

#### (6) Callbacks

Langchain提供了一系列系统级别的回调函数，也就是在整个生命周期内的Hook钩子，以便于用户在应用层做日志、监控等其他处理。常见的回调函数如```on_llm_start/on_chat_model_start/on_chain_start/on_tool_start/on_agent_action``` 更多请参考文档[回调函数](https://python.langchain.com/docs/modules/callbacks/)

![image](https://github.com/WGrape/Blog/assets/35942268/ab3ce8eb-b9d2-4473-9b94-105805b5d52b)

在下面这个例子中，会定义一个```on_chain_start```的自定义回调函数

```python
# 定义一个自定义的回调函数
from typing import Any, Dict
from langchain.callbacks.base import BaseCallbackHandler
class MyCustomHandler(BaseCallbackHandler):
    def on_chain_start(
            self, serialized: Dict[str, Any], inputs: Dict[str, Any], **kwargs: Any
    ) -> None:
        """Print out that we are entering a chain."""
        class_name = serialized.get("name", serialized.get("id", ["<unknown>"])[-1])
        print(f"\n\n\033[1m> [This is custom callback handler] Entering new {class_name} chain...\033[0m")

# 创建llm/prompt/handler
from langchain_openai import OpenAI
from langchain.prompts import PromptTemplate
llm = OpenAI()
prompt = PromptTemplate.from_template("1 + {number} = ")
handler = MyCustomHandler()

# 链式调用
from langchain.chains import LLMChain
chain = LLMChain(llm=llm, prompt=prompt, callbacks=[handler], verbose=True)
chain.invoke({"number": 2})
```

<img width="518" alt="image" src="https://github.com/WGrape/Blog/assets/35942268/5dbfc098-995b-4d0d-a88d-8d6bb3da5107">

### 3. 模块总结
根据上述的理解，对LangChain核心模块的总结如下所示

<img width="700" alt="image" src="https://github.com/WGrape/Blog/assets/35942268/388b61dd-28ad-443a-8c0e-2bcb7463a274">

## 四. 优雅且高效的LCEL

### 1. 介绍
LCEL（LangChain Expression Language）是一种构建复杂链的简便方法，语法是使用```|```或运算符自动创建Chain后，即可完成链式操作。这在背后的原理是python的```__ror__```魔术函数，比如```chain = prompt | model```就相当于```chain = prompt.__or__(model)```。

下面看一个简单的LCEL代码，按照传统的方式创建```prompt/model/output_parser```，然后再使用```|```或运算符创建了一个Chain，它自动把这3个组件链接在了一起，这都是在底层实现的，对应用层十分友好 ！

```python
from langchain_core.output_parsers import StrOutputParser
from langchain_core.prompts import ChatPromptTemplate
from langchain_openai import ChatOpenAI

prompt = ChatPromptTemplate.from_template("tell me a short joke about {topic}")
model = ChatOpenAI()
output_parser = StrOutputParser()

chain = prompt | model | output_parser

print(chain.invoke({"topic": "math"}))
```

在LCEL的底层，主要是实现了一套通用的```Runnable```协议，只要各类组件遵循并实现此协议，便可以自动完成链式组合和调用。

1. 统一的接口 ：每个LCEL对象都实现该Runnable接口，该接口定义了一组通用的调用方法（invoke、batch、stream、ainvoke、 …）。这使得LCEL对象链也可以自动支持这些调用。也就是说，每个LCEL对象链本身就是一个LCEL对象。
2. 组合原语 ：LCEL提供了许多原语（比如__ror__魔术函数），可以轻松组合链、并行化组件、添加后备、动态配置链内部等等。

### 2. 为什么使用LECL

LCEL对链式、流式操作等天然的支持，可以非常高效的代替传统的Chain操作，不但方便简单、而且容易理解。从下面的示例对比中可以直观的看出来，更多的对比例子可以查看[why文档](https://python.langchain.com/docs/expression_language/why)。

<img width="600" src="https://github.com/WGrape/Blog/assets/35942268/831b0535-22e1-413e-b235-f2c5c2811ad0">

### 3. 简单的上手示例

```python
from langchain_core.output_parsers import StrOutputParser
from langchain_core.prompts import ChatPromptTemplate
from langchain_openai import ChatOpenAI

prompt = ChatPromptTemplate.from_template("tell me a short joke about {topic}")
model = ChatOpenAI()
output_parser = StrOutputParser()

chain = prompt | model | output_parser

# invoke: 普通输出
print(chain.invoke({"topic": "math"}))

# ainvoke: 异步输出
chain.ainvoke({"topic": "math"})

# stream: 流式输出
for chunk in chain.stream({"topic": "math"}):
    print(chunk, end="", flush=True)

# Batch: 批量输入
print(chain.batch([{"topic": "math"}, {"topic": "English"}]))
```

### 4. 使用场景大全

官方给出了一份[How to](https://python.langchain.com/docs/expression_language/how_to/)完善的使用场景大全。


### 5. Cookbook大全

官方给出了一份[Cookbook](https://python.langchain.com/docs/expression_language/cookbook/)大全，这些示例展示了如何组合不同的 Runnable (核心 LCEL 接口)组件来实现各种任务。

- Prompt + LLM
- RAG
- Multiple chains
- Querying a SQL DB
- Agents
- Using tools

更多使用场景和示例，可以自行查看

## 五. 总结

总的来说，LangChain提供了一种灵活、强大的工具，用于将各种操作组合在一起，从而实现复杂的自然语言处理任务。通过本教程的学习，可以对LangChain有了一个全面的了解，并且能够使用它进行链式操作的构建和管理。

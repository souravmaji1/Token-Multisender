import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Bitcoin, Menu, X } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

export default function Component() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <div className="bg-gradient-to-b from-purple-900 to-indigo-900 text-white">
      <header className="px-4 lg:px-6 h-16 flex items-center">
        <Link className="flex items-center justify-center" href="#">
          <Bitcoin className="h-6 w-6 mr-2" />
          <span className="font-bold">BlockChain</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Button
            className="lg:hidden"
            variant="ghost"
            size="icon"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            <span className="sr-only">Toggle Menu</span>
          </Button>
          <div className={`${isMenuOpen ? 'flex' : 'hidden'} lg:flex flex-col lg:flex-row absolute lg:relative top-16 lg:top-0 left-0 lg:left-auto bg-purple-900 lg:bg-transparent w-full lg:w-auto items-center gap-4 lg:gap-6 p-4 lg:p-0`}>
            <Link
              className="text-sm font-medium hover:underline underline-offset-4"
              href="#"
            >
              Home
            </Link>
            <Link
              className="text-sm font-medium hover:underline underline-offset-4"
              href="#"
            >
              About
            </Link>
            <Link
              className="text-sm font-medium hover:underline underline-offset-4"
              href="#"
            >
              Services
            </Link>
            <Link
              className="text-sm font-medium hover:underline underline-offset-4"
              href="#"
            >
              Contact
            </Link>
          
          </div>
        </nav>
      </header>
      <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center space-y-4 text-center">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                Revolutionize Your Finances with Blockchain
              </h1>
              <p className="mx-auto max-w-[700px] text-gray-300 md:text-xl">
                Secure, transparent, and efficient. Join the future of digital transactions and decentralized finance.
              </p>
            </div>
            <div className="space-x-4">
              <Link href='/tokensend'>
              <Button className="bg-[#CBACF9] text-purple-900 hover:bg-gray-200">Get Started</Button>
              </Link>
              
           
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}